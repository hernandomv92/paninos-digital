from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255)
    loggro_id = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image_url = models.URLField(max_length=500, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    loggro_id = models.CharField(max_length=100, unique=True)
    stock = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    @property
    def is_available(self):
        """Product is available if it's active and has stock"""
        return self.is_active and self.stock > 0

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    customer_data = models.JSONField(default=dict)
    loggro_order_id = models.CharField(max_length=100, unique=True, null=True, blank=True)

    def __str__(self):
        return f"Order {self.id} - {self.status}"
