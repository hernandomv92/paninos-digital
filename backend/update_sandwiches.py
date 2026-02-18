import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Product

print("\n--- UPDATING SANDWICHES STOCK ---")
sandwiches = Product.objects.filter(name__startswith="SAND")
if sandwiches.exists():
    count = sandwiches.update(stock=50) # Set stock to 50 for all
    print(f"Updated stock for {count} sandwiches to 50.")
else:
    print("No sandwiches found starting with 'SAND'")
