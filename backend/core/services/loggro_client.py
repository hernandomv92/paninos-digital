import os
import logging
import requests
from typing import Optional

logger = logging.getLogger(__name__)

# ── Constantes del negocio Paninos (obtenidas explorando la API real) ──────────
# Mesa "Caja" - se usa para TODOS los pedidos web (pickup y domicilio)
LOGGRO_TABLE_CAJA_ID   = "6769a9bd3feeb8457a7f512c"
# Almacén/ubicación de stock (único: "General")
LOGGRO_LOCATION_STOCK  = "6769a9bc3feeb8457a7f50f0"
# Vendedor por defecto (Cajero)
LOGGRO_SELLER_ID       = "67872da9bca2d0f342a0a404"


class LoggroClient:
    """
    Cliente para la API PirPos / Loggro.
    Base URL: https://api.pirpos.com

    Flujo real de pedidos:
      1. POST /login              → obtiene tokenCurrent
      2. GET  /products           → lista productos con sus _id de Loggro
      3. POST /orders             → crea un pedido en cocina (estado "Espera")
                                    Aparece en pantalla de comandas y Ventas > Pedidos.

    NOTA: /invoices es para facturas ya pagadas (cierre de caja).
    Los pedidos web van a /orders → llegan a cocina → el cajero los cobra.
    """

    def __init__(self):
        self.email    = os.getenv("LOGGRO_EMAIL")
        self.password = os.getenv("LOGGRO_PASSWORD")
        self.base_url = os.getenv("LOGGRO_API_URL", "https://api.pirpos.com").rstrip("/")
        self.token: Optional[str] = None

    # ── Autenticación ─────────────────────────────────────────────────────────

    def _login(self):
        if not self.email or not self.password:
            raise ValueError("LOGGRO_EMAIL o LOGGRO_PASSWORD no configurados.")
        try:
            response = requests.post(
                f"{self.base_url}/login",
                json={"email": self.email, "password": self.password},
                timeout=15,
            )
            response.raise_for_status()
            self.token = response.json().get("tokenCurrent")
            if not self.token:
                raise ValueError("tokenCurrent no encontrado en la respuesta de login.")
            logger.info("LoggroClient: Login exitoso.")
        except requests.RequestException as e:
            logger.error(f"LoggroClient: Login fallido: {e}")
            raise

    def _headers(self):
        if not self.token:
            self._login()
        return {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}

    def _request(self, method: str, endpoint: str, **kwargs):
        """Petición con reintento automático en token expirado."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        r = requests.request(method, url, headers=self._headers(), timeout=15, **kwargs)
        if r.status_code == 401:
            logger.info("LoggroClient: Token expirado, renovando...")
            self._login()
            r = requests.request(method, url, headers=self._headers(), timeout=15, **kwargs)
        r.raise_for_status()
        return r

    # ── Productos ─────────────────────────────────────────────────────────────

    def get_products(self) -> list:
        """Retorna todos los productos. El precio real está en locationsStock[0].price."""
        r = self._request("GET", "/products")
        data = r.json()
        if isinstance(data, list):
            return data
        for val in data.values():
            if isinstance(val, list):
                return val
        return []

    # ── Pedidos ───────────────────────────────────────────────────────────────

    def create_order(
        self,
        items: list,
        customer_name: str,
        customer_phone: str,
        order_type: str = "pickup",
        payment_method: str = "store",
        delivery_address: str = "",
        delivery_reference: str = "",
        delivery_fee: float = 0.0,
        notes: str = "",
    ) -> dict:
        """
        Crea un pedido en Loggro usando POST /orders.
        El pedido aparece inmediatamente en:
          - Pantalla digital de comandas (cocina)
          - Ventas → Pedidos (panel Loggro)

        Tanto pickup como domicilio usan la mesa "Caja".
        La dirección de domicilio se incluye en las notas del primer item.

        Args:
            items: Lista de dicts con {loggro_id, name, quantity, price}
            customer_name:    Nombre del cliente (va en groupName)
            customer_phone:   Teléfono del cliente (va en groupName)
            order_type:       "pickup" | "delivery"
            payment_method:   "store" | "cash" | "online"
            delivery_address: Dirección de entrega (solo domicilio)
            delivery_reference: Apto/torre (solo domicilio)
            delivery_fee:     Costo del domicilio
            notes:            Notas adicionales del cliente

        Returns:
            {"success": True, "orders": [...], "group": "...", "groupName": "..."}
        """
        is_delivery = order_type == "delivery"

        # Nombre descriptivo del grupo (visible en Loggro)
        tipo = "DOMICILIO" if is_delivery else "RECOGIDA"
        group_name = f"[WEB {tipo}] {customer_name} - {customer_phone}"

        # Construir notas del primer item con info de entrega
        first_item_notes = []
        if is_delivery and delivery_address:
            first_item_notes.append(f"Dir: {delivery_address}")
            if delivery_reference:
                first_item_notes.append(f"Ref: {delivery_reference}")
            if delivery_fee:
                first_item_notes.append(f"Domicilio: ${delivery_fee:,.0f}")
        if notes:
            first_item_notes.append(notes)

        # Mapear método de pago a texto legible en Loggro
        payment_label = {
            "online": "Pago online (Bold)",
            "cash": "Pago contra entrega",
            "store": "Pago en tienda",
        }.get(payment_method, payment_method)
        first_item_notes.append(f"Pago: {payment_label}")

        # Construir lista de items en formato Loggro
        loggro_orders = []
        for i, item in enumerate(items):
            order_item = {
                "product": item["loggro_id"],
                "quantity": item["quantity"],
                "unit_price": float(item["price"]),
                "locationStock": LOGGRO_LOCATION_STOCK,
            }
            # Las notas de entrega van en el primer item
            if i == 0 and first_item_notes:
                order_item["notes"] = first_item_notes
            loggro_orders.append(order_item)

        payload = {
            "table": LOGGRO_TABLE_CAJA_ID,
            "groupName": group_name,
            "orders": loggro_orders,
        }

        logger.info(
            f"LoggroClient: Creando pedido '{group_name}' "
            f"({len(items)} items, tipo={order_type})"
        )

        try:
            r = self._request("POST", "/orders", json=payload)
            created = r.json()  # Lista de pedidos creados
            group_id = created[0].get("group") if isinstance(created, list) and created else None

            logger.info(
                f"LoggroClient: Pedido creado. group={group_id}, "
                f"items={len(created) if isinstance(created, list) else '?'}"
            )
            return {
                "success": True,
                "group": group_id,
                "groupName": group_name,
                "orders": created,
            }
        except requests.RequestException as e:
            logger.error(f"LoggroClient: create_order fallido: {e}")
            raise
