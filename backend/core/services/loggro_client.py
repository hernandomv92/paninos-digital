import os
import requests
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Constantes de Loggro - obtenidas explorando la API real
LOGGRO_TABLE_ID = "6769a9bd3feeb8457a7f512c"   # Mesa "Caja" (única mesa activa)
LOGGRO_TABLE_NAME = "Caja"
LOGGRO_SELLER_ID = "67872da9bca2d0f342a0a404"   # Cajero (usuario principal)
LOGGRO_SELLER_NAME = "Cajero"
LOGGRO_PAYMENT_EFECTIVO = "Efectivo"
LOGGRO_PAYMENT_TARJETA = "Tarjeta"


class LoggroClient:
    """
    Cliente para la API PirPos / Loggro.
    Base URL: https://api.pirpos.com
    
    Endpoints utilizados:
      POST /login            → autenticación, retorna tokenCurrent
      GET  /products         → lista de productos del negocio
      GET  /categories       → categorías de productos
      POST /invoices         → crear factura/venta (responde 202 async)
    """

    def __init__(self):
        self.email = os.getenv("LOGGRO_EMAIL")
        self.password = os.getenv("LOGGRO_PASSWORD")
        self.base_url = os.getenv("LOGGRO_API_URL", "https://api.pirpos.com").rstrip("/")
        self.token: Optional[str] = None

    # ── Auth ─────────────────────────────────────────────────────────────────

    def _login(self):
        if not self.email or not self.password:
            raise ValueError("LOGGRO_EMAIL o LOGGRO_PASSWORD no configurados en el entorno.")

        url = f"{self.base_url}/login"
        payload = {"email": self.email, "password": self.password}

        try:
            response = requests.post(url, json=payload, timeout=15)
            response.raise_for_status()
            data = response.json()
            self.token = data.get("tokenCurrent")
            if not self.token:
                raise ValueError(f"Token no encontrado en la respuesta de login. Keys: {list(data.keys())}")
            logger.info("LoggroClient: Login exitoso.")
        except requests.RequestException as e:
            logger.error(f"LoggroClient: Login fallido: {e}")
            raise

    def _get_headers(self):
        if not self.token:
            self._login()
        return {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}

    def _request(self, method: str, endpoint: str, **kwargs):
        """Ejecuta una petición con reintentos de autenticación automáticos."""
        headers = self._get_headers()
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = requests.request(method, url, headers=headers, timeout=15, **kwargs)

        if response.status_code == 401:
            # Token expirado - intentar re-login una vez
            logger.info("LoggroClient: Token expirado, renovando...")
            self._login()
            headers = self._get_headers()
            response = requests.request(method, url, headers=headers, timeout=15, **kwargs)

        response.raise_for_status()
        return response

    # ── Productos ─────────────────────────────────────────────────────────────

    def get_products(self) -> list:
        """
        Retorna la lista de productos desde Loggro.
        El precio real viene en locationsStock[0].price, no en product.price.
        """
        try:
            response = self._request("GET", "/products")
            data = response.json()

            if isinstance(data, list):
                return data
            if isinstance(data, dict):
                for val in data.values():
                    if isinstance(val, list):
                        return val
            return []

        except requests.RequestException as e:
            logger.error(f"LoggroClient: get_products fallido: {e}")
            raise

    def get_categories(self) -> list:
        """Retorna categorías de productos."""
        try:
            response = self._request("GET", "/categories")
            data = response.json()
            return data if isinstance(data, list) else []
        except requests.RequestException as e:
            logger.error(f"LoggroClient: get_categories fallido: {e}")
            raise

    # ── Órdenes / Facturas ────────────────────────────────────────────────────

    def create_invoice(
        self,
        items: list,
        customer_name: str = "Consumidor",
        customer_phone: str = "0000000000",
        customer_document: str = "222222222222",
        payment_method: str = "Efectivo",
        total: float = 0.0,
        is_delivery: bool = False,
        delivery_address: str = "",
        delivery_cost: float = 0.0,
        notes: str = "",
    ) -> dict:
        """
        Crea una factura en Loggro.

        Args:
            items: Lista de dicts con {loggro_id, name, quantity, price}
            customer_name: Nombre del cliente (para factura)
            customer_phone: Teléfono del cliente
            customer_document: CC/NIT del cliente (default: Consumidor Final)
            payment_method: "Efectivo" | "Tarjeta"
            total: Total de la factura
            is_delivery: Si es un domicilio
            delivery_address: Dirección de entrega
            delivery_cost: Costo del domicilio
            notes: Notas adicionales del pedido

        Returns:
            dict con la respuesta de Loggro (usualmente {"message": {}})
        """
        # Mapear método de pago al nombre que usa Loggro
        payment_name = LOGGRO_PAYMENT_TARJETA if payment_method in ("online", "Tarjeta", "tarjeta") else LOGGRO_PAYMENT_EFECTIVO

        # Construir productos en formato Loggro
        loggro_products = [
            {
                "idInternal": item["loggro_id"],
                "quantity": item["quantity"],
                "price": float(item["price"]),
                "discount": 0,
            }
            for item in items
        ]

        # Construir payload completo de factura
        payload = {
            "products": loggro_products,
            "table": {
                "idInternal": LOGGRO_TABLE_ID,
                "name": LOGGRO_TABLE_NAME,
            },
            "seller": {
                "idInternal": LOGGRO_SELLER_ID,
                "name": LOGGRO_SELLER_NAME,
            },
            "cashier": {
                "idInternal": LOGGRO_SELLER_ID,
                "name": LOGGRO_SELLER_NAME,
            },
            "client": {
                "name": customer_name,
                "lastName": "Final",
                "phone": customer_phone,
                "email": "no-reply@loggro.com",
                "document": customer_document,
                "isSocialReason": True,
                "responsibilities": "R-99-PN",
                "idDocumentType": "13",
            },
            "paid": {
                "paymentMethodValue": [
                    {
                        "paymentMethod": payment_name,
                        "value": float(total),
                        "tip": 0,
                        "deliveryCost": float(delivery_cost) if is_delivery else 0,
                    }
                ]
            },
            "delivery": {
                "isDelivery": is_delivery,
                "address": delivery_address if is_delivery else "",
            },
            "total": float(total),
        }

        # Agregar notas si hay
        if notes:
            payload["notes"] = notes

        logger.info(f"LoggroClient: Creando factura - {len(items)} productos, total ${total:,.0f}, delivery={is_delivery}")

        try:
            response = self._request("POST", "/invoices", json=payload)
            data = response.json()
            logger.info(f"LoggroClient: Factura creada exitosamente. Status: {response.status_code}")
            return {"success": True, "status_code": response.status_code, "data": data}
        except requests.RequestException as e:
            logger.error(f"LoggroClient: create_invoice fallido: {e}")
            raise
