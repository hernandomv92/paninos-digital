from django.core.management.base import BaseCommand
from core.models import Product, Category
from core.services.loggro_client import LoggroClient
from django.db import transaction

class Command(BaseCommand):
    help = 'Syncs menu from Loggro API'

    def extract_stock(self, prod_data):
        """
        Extract stock from Loggro API response with proper priority handling.
        
        PRIORITY ORDER:
        1. locationsStock[].stock - Most accurate, used by Mixed/WithIngredients types
        2. Direct stock field - Fallback for simple inventory
        3. isActive status - Last resort for ingredient-based products
        
        INVENTORY TYPES:
        - "WithIngredients": Stock calculated from ingredients, use isActive
        - "Mixed": Stock stored in locationsStock array (MOST COMMON)
        - "Normal": Direct stock field
        
        Returns: Integer stock value (0 if unavailable, 999 if unlimited)
        """
        inventory_type = prod_data.get('inventoryType', '')
        is_active = prod_data.get('isActive', True)
        
        # PRIORITY 1: Check locationsStock array FIRST (most reliable)
        # This is where Loggro stores the actual stock for Mixed/WithIngredients products
        if 'locationsStock' in prod_data and isinstance(prod_data['locationsStock'], list):
            for loc in prod_data['locationsStock']:
                # Try multiple field names in order of preference
                for field in ['stock', 'currentStock', 'quantity']:
                    if field in loc:
                        try:
                            stock_value = loc[field]
                            # Accept any non-negative value (including 0)
                            if stock_value is not None and isinstance(stock_value, (int, float, str)):
                                stock_int = int(float(stock_value))
                                # For Mixed/WithIngredients, trust the locationsStock value
                                if inventory_type in ['Mixed', 'WithIngredients']:
                                    return stock_int
                                # For other types, only return if > 0
                                elif stock_int > 0:
                                    return stock_int
                        except (ValueError, TypeError):
                            continue
        
        # PRIORITY 2: Try direct stock fields (fallback for Normal inventory)
        for field in ['stock', 'currentStock', 'inventory']:
            if field in prod_data:
                try:
                    stock_value = prod_data[field]
                    if stock_value is not None and stock_value > 0:
                        return int(float(stock_value))
                except (ValueError, TypeError):
                    continue
        
        # PRIORITY 3: Special handling for WithIngredients type
        # These products calculate stock dynamically from ingredients
        if inventory_type == 'WithIngredients':
            if is_active:
                return 999  # Unlimited/Available
            else:
                return 0  # Not available
        
        # PRIORITY 4: If product is active but no stock found, assume available
        # This handles edge cases where stock tracking is disabled
        if is_active:
            return 999  # Unlimited/Available
        
        # Default: Product is inactive or no stock data
        return 0

    def handle(self, *args, **options):
        self.stdout.write("Starting menu sync...")
        client = LoggroClient()
        
        try:
            products_data = client.get_products()
            self.stdout.write(f"Fetched {len(products_data)} products from Loggro.")
            
            # Debug: Print first product structure to identify stock field
            if products_data:
                import json
                self.stdout.write("\n=== DEBUG: First Product Structure ===")
                self.stdout.write(json.dumps(products_data[0], indent=2, default=str))
                self.stdout.write("=" * 50 + "\n")
            
            with transaction.atomic():
                for prod_data in products_data:
                    # 1. Handle Category
                    cat_data = prod_data.get('category')
                    category = None
                    if cat_data and isinstance(cat_data, dict):
                        cat_loggro_id = cat_data.get('_id')
                        cat_name = cat_data.get('name')
                        
                        if cat_loggro_id and cat_name:
                            category, created = Category.objects.update_or_create(
                                loggro_id=cat_loggro_id,
                                defaults={'name': cat_name}
                            )
                    
                    # 2. Handle Price (Logic to find non-zero price)
                    price = prod_data.get('price', 0)
                    original_price = None
                    
                    if price == 0 and 'locationsStock' in prod_data:
                        for loc in prod_data['locationsStock']:
                            loc_price = loc.get('price', 0)
                            if loc_price > 0:
                                price = loc_price
                                break
                    
                    # Check for original price (for discounts)
                    if 'originalPrice' in prod_data and prod_data['originalPrice']:
                        try:
                            original_price = float(prod_data['originalPrice'])
                        except (ValueError, TypeError):
                            pass
                    
                    # 3. Extract Stock
                    stock = self.extract_stock(prod_data)
                    
                    # 4. Check if product is active
                    is_active = prod_data.get('isActive', True)
                    if isinstance(is_active, str):
                        is_active = is_active.lower() in ['true', '1', 'yes']
                    
                    # 5. Handle Product
                    loggro_id = prod_data.get('_id')
                    name = prod_data.get('name')
                    
                    if loggro_id and name:
                        product, created = Product.objects.update_or_create(
                            loggro_id=loggro_id,
                            defaults={
                                'name': name,
                                'description': prod_data.get('description', ''),
                                'price': price,
                                'original_price': original_price,
                                'image_url': prod_data.get('image', None),
                                'category': category,
                                'stock': stock,
                                'is_active': is_active
                            }
                        )
                        
                        action = "Created" if created else "Updated"
                        availability = "✓ Available" if product.is_available else "✗ Out of stock"
                        msg = f"{action}: {product.name} (${product.price}) - Stock: {product.stock} {availability}"
                        self.stdout.write(self.style.SUCCESS(msg))
                        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error syncing menu: {e}"))
            import traceback
            self.stdout.write(self.style.ERROR(traceback.format_exc()))

