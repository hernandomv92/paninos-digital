import os
import sys
import django
import json

# Add backend to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.services.loggro_client import LoggroClient

def inspect_product():
    client = LoggroClient()
    print("Fetching products...")
    try:
        products = client.get_products()
        if products:
            print(f"Found {len(products)} products.")
            first_product = products[0]
            
            # Save to file for clear inspection
            with open('product_sample.json', 'w', encoding='utf-8') as f:
                json.dump(first_product, f, indent=2, ensure_ascii=False)
            
            print("First product saved to product_sample.json")
        else:
            print("No products found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_product()
