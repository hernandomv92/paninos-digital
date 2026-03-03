from django.core.management.base import BaseCommand
from core.models import Product, Category
from core.services.loggro_client import LoggroClient
from django.db import transaction

class Command(BaseCommand):
    help = 'Syncs menu from Loggro API'

    def extract_stock(self, prod_data):
        """
        Extract stock from Loggro API response with proper priority handling.
        
        INVENTORY TYPES:
        - "WithIngredients": Stock calculated dynamically from ingredients.
          If isActive=True → Available (return 999). Ignore locationsStock.stock.
        - "Mixed": Stock stored in locationsStock array.
        - "Normal" / "PerUnit": Direct stock in locationsStock or top-level.
        
        Returns: Integer stock value (0 if unavailable, 999 if unlimited/active)
        """
        inventory_type = prod_data.get('inventoryType', '')
        is_active = prod_data.get('isActive', True)
        
        # WithIngredients: stock is dynamic from ingredients — trust isActive only
        if inventory_type == 'WithIngredients':
            return 999 if is_active else 0
        
        # For all other types: check locationsStock array first (most reliable)
        if 'locationsStock' in prod_data and isinstance(prod_data['locationsStock'], list):
            for loc in prod_data['locationsStock']:
                for field in ['stock', 'currentStock', 'quantity']:
                    if field in loc:
                        try:
                            stock_value = loc[field]
                            if stock_value is not None and isinstance(stock_value, (int, float, str)):
                                stock_int = int(float(stock_value))
                                # For Mixed type trust the value (even if 0)
                                if inventory_type == 'Mixed':
                                    return stock_int
                                # For other types only return if > 0
                                elif stock_int > 0:
                                    return stock_int
                        except (ValueError, TypeError):
                            continue
        
        # Fallback: direct top-level stock fields
        for field in ['stock', 'currentStock', 'inventory']:
            if field in prod_data:
                try:
                    stock_value = prod_data[field]
                    if stock_value is not None and stock_value > 0:
                        return int(float(stock_value))
                except (ValueError, TypeError):
                    continue
        
        # If product is active but no stock data found, assume available
        if is_active:
            return 999
        
        return 0


    def handle(self, *args, **options):
        self.stdout.write("Starting menu sync...")
        client = LoggroClient()
        
        # Categorías que NO deben aparecer en el menú del cliente
        EXCLUDED_CATEGORIES = {
            'Devoluciones', 'Desechables', 'Domicilios', 'Carnes',
            'Adiciones Paninos', 'Papas Monterojo',
        }
        
        try:
            products_data = client.get_products()
            self.stdout.write(f"Fetched {len(products_data)} products from Loggro.")
            
            skipped = 0
            synced = 0
            
            with transaction.atomic():
                for prod_data in products_data:
                    # 1. Handle Category
                    cat_data = prod_data.get('category')
                    category = None
                    if cat_data and isinstance(cat_data, dict):
                        cat_loggro_id = cat_data.get('_id')
                        cat_name = cat_data.get('name')
                        
                        # Skip categorías operacionales (no deben salir en el menú)
                        if cat_name in EXCLUDED_CATEGORIES:
                            skipped += 1
                            self.stdout.write(f"  ⏭ Skipped (cat excluded): {prod_data.get('name')} [{cat_name}]")
                            continue
                        
                        if cat_loggro_id and cat_name:
                            category, created = Category.objects.update_or_create(
                                loggro_id=cat_loggro_id,
                                defaults={'name': cat_name}
                            )
                    
                    # 2. Handle Price — ALWAYS prefer locationsStock[].price because
                    # Loggro stores the real sale price there; the top-level "price"
                    # field is almost always 0 for POS-managed products.
                    price = 0
                    if 'locationsStock' in prod_data:
                        for loc in prod_data['locationsStock']:
                            loc_price = loc.get('price', 0)
                            if loc_price > 0:
                                price = loc_price
                                break
                    # Fallback to top-level price if locationsStock has nothing
                    if price == 0:
                        price = prod_data.get('price', 0)
                    
                    # Check for original price (for discounts)
                    original_price = None
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
                        
                        synced += 1
                        action = "Created" if created else "Updated"
                        availability = "✓ Available" if product.is_available else "✗ Out of stock"
                        msg = f"{action}: {product.name} (${product.price:,.0f}) - Stock: {product.stock} {availability}"
                        self.stdout.write(self.style.SUCCESS(msg))
                        
            self.stdout.write(self.style.SUCCESS(
                f"\n✅ Sync done. Synced: {synced} | Skipped: {skipped}"
            ))
                        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error syncing menu: {e}"))
            import traceback
            self.stdout.write(self.style.ERROR(traceback.format_exc()))
