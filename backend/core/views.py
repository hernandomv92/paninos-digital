from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Order
from .serializers import CategorySerializer, OrderSerializer

class MenuListView(generics.ListAPIView):
    queryset = Category.objects.all().prefetch_related('products')
    serializer_class = CategorySerializer

class CreateOrderView(APIView):
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            
            # TODO: Enable Loggro Injection
            print(f"SIMULACIÓN: Pedido {order.id} listo para enviarse a Loggro")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
