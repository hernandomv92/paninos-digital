import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Product

print("\n--- SANDWICHES IN DATABASE ---")
sandwiches = Product.objects.filter(name__startswith="SAND")
if sandwiches.exists():
    for p in sandwiches:
        print(f"{p.name} - Stock: {p.stock}, Active: {p.is_active}")
else:
    print("No sandwiches found starting with 'SAND'")
