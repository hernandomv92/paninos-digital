from django.urls import path
from .views import MenuListView, CreateOrderView
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('menu/', MenuListView.as_view(), name='menu-list'),
    path('orders/', CreateOrderView.as_view(), name='create-order'),
]
