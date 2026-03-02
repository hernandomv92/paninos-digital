import logging
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Order, Product
from .serializers import CategorySerializer, OrderSerializer

logger = logging.getLogger(__name__)


class MenuListView(generics.ListAPIView):
    """
    GET /api/menu/
    Retorna categorías con sus productos activos.
    """
    queryset = Category.objects.all().prefetch_related('products')
    serializer_class = CategorySerializer


class CreateOrderView(APIView):
    """
    POST /api/orders/
    Recibe el pedido del frontend, lo guarda en BD y lo envía a Loggro.
    
    Payload esperado:
    {
        "customer_data": {
            "customer_name": "Juan Pérez",
            "customer_phone": "3001234567",
            "order_type": "pickup" | "delivery",
            "payment_method": "store" | "cash" | "online",
            "delivery_address": "...",    // solo si es delivery
            "delivery_reference": "...",  // opcional
            "notes": "...",               // opcional
            "location_id": 1,
            "delivery_fee": 0,
            "total": 28000
        },
        "items": [
            {"product_id": 1, "quantity": 2}
        ]
    }
    """

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Guardar la orden en la base de datos local
        order = serializer.save()

        # Intentar enviar a Loggro
        loggro_order_id = None
        loggro_error = None

        try:
            loggro_order_id = self._send_to_loggro(order)
            if loggro_order_id:
                order.loggro_order_id = loggro_order_id
                order.status = 'CONFIRMED'
                order.save(update_fields=['loggro_order_id', 'status'])
                logger.info(f"Order {order.id} enviado a Loggro. loggro_order_id={loggro_order_id}")
        except Exception as e:
            loggro_error = str(e)
            logger.error(f"Error al enviar orden {order.id} a Loggro: {e}")
            # La orden se guardó en BD pero no llegó a Loggro
            # No fallamos el request - devolvemos la orden con la advertencia

        response_data = serializer.data
        response_data['loggro_order_id'] = loggro_order_id
        if loggro_error:
            response_data['loggro_warning'] = f"La orden se guardó localmente pero hubo un problema con Loggro: {loggro_error}"

        return Response(response_data, status=status.HTTP_201_CREATED)

    def _send_to_loggro(self, order: Order) -> str | None:
        """
        Construye el payload para Loggro y crea la factura.
        Retorna el loggro_order_id (o None si no hay ID en la respuesta).
        """
        from .services.loggro_client import LoggroClient

        customer = order.customer_data
        items_data = customer.get('items', [])

        if not items_data:
            logger.warning(f"Order {order.id} sin items - saltando envío a Loggro")
            return None

        # Construir items en el formato que espera LoggroClient
        loggro_items = []
        for item in items_data:
            product_id = item.get('product_id')
            try:
                product = Product.objects.get(id=product_id)
                loggro_id = product.loggro_id
                if not loggro_id:
                    logger.warning(f"Producto {product.name} no tiene loggro_id, saltando")
                    continue
                loggro_items.append({
                    "loggro_id": loggro_id,
                    "name": product.name,
                    "quantity": item.get('quantity', 1),
                    "price": float(item.get('price', product.price)),
                })
            except Product.DoesNotExist:
                logger.warning(f"Producto ID={product_id} no encontrado en BD")

        if not loggro_items:
            logger.warning(f"Order {order.id} sin items válidos para Loggro")
            return None

        is_delivery = customer.get('order_type') == 'delivery'
        payment_method = customer.get('payment_method', 'store')
        total = float(order.total)
        delivery_fee = float(customer.get('delivery_fee', 0))

        client = LoggroClient()
        result = client.create_order(
            items=loggro_items,
            customer_name=customer.get('customer_name', 'Consumidor'),
            customer_phone=customer.get('customer_phone', '0000000000'),
            order_type=customer.get('order_type', 'pickup'),
            payment_method=payment_method,
            delivery_address=customer.get('delivery_address', ''),
            delivery_reference=customer.get('delivery_reference', ''),
            delivery_fee=float(customer.get('delivery_fee', 0)),
            notes=customer.get('notes', ''),
        )

        # Loggro retorna {"message": {}} - no hay un ID explícito de factura
        # Usamos el ID de nuestro sistema como referencia
        loggro_group_id = result.get('group')
        return loggro_group_id or f"LOGGRO-OK-{order.id}"
