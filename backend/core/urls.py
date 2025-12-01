from django.urls import path
from .views import MenuListView, CreateOrderView

urlpatterns = [
    path('menu/', MenuListView.as_view(), name='menu-list'),
    path('orders/', CreateOrderView.as_view(), name='create-order'),
]
