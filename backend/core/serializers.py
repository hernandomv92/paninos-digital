from rest_framework import serializers
from .models import Product, Category, Order

class ProductSerializer(serializers.ModelSerializer):
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'original_price', 'description', 'image_url', 'stock', 'is_available']

class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'products']

class OrderItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'total', 'created_at', 'customer_data', 'items']
        read_only_fields = ['id', 'status', 'total', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        # Calculate total and build item details (including loggro_id for Loggro invoice)
        total = 0
        order_items_details = []

        for item in items_data:
            try:
                product = Product.objects.get(id=item['product_id'])
                item_price = float(product.price)
                item_total = item_price * item['quantity']
                total += item_total
                order_items_details.append({
                    'product_id': product.id,
                    'loggro_id': product.loggro_id,  # Required for Loggro invoice
                    'name': product.name,
                    'price': item_price,
                    'quantity': item['quantity'],
                    'subtotal': item_total,
                })
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f"Producto con id {item['product_id']} no existe"
                )

        # Merge items into customer_data (holds all order metadata)
        customer_data = validated_data.get('customer_data', {})
        customer_data['items'] = order_items_details
        validated_data['customer_data'] = customer_data
        validated_data['total'] = total

        order = Order.objects.create(**validated_data)
        return order
