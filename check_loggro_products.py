"""
Script para ver todos los productos de Loggro y comparar con lo que tenemos en el frontend.
Ejecutar desde la raíz del proyecto: python check_loggro_products.py
"""
import os
import json
import requests
from dotenv import load_dotenv

# Cargar variables de entorno desde backend/.env
load_dotenv("backend/.env")

BASE_URL = os.getenv("LOGGRO_API_URL", "https://api.pirpos.com").rstrip("/")
email = os.getenv("LOGGRO_EMAIL")
password = os.getenv("LOGGRO_PASSWORD")

def login():
    resp = requests.post(f"{BASE_URL}/login", json={"email": email, "password": password}, timeout=15)
    resp.raise_for_status()
    token = resp.json().get("tokenCurrent")
    print(f"✅ Login exitoso.")
    return token

def get_all_products(token):
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(f"{BASE_URL}/products", headers=headers, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    if isinstance(data, list):
        return data
    for val in data.values():
        if isinstance(val, list):
            return val
    return []

if __name__ == "__main__":
    print("=" * 70)
    print("CONSULTANDO PRODUCTOS EN LOGGRO")
    print("=" * 70)

    token = login()
    products = get_all_products(token)
    print(f"Total de productos en Loggro: {len(products)}\n")

    # Agrupar por categoría
    categories = {}
    for p in products:
        cat = p.get("category", {})
        cat_name = cat.get("name", "Sin categoría") if isinstance(cat, dict) else str(cat)
        if cat_name not in categories:
            categories[cat_name] = []
        categories[cat_name].append(p)

    print("=" * 70)
    print(f"CATEGORÍAS ENCONTRADAS ({len(categories)}):")
    for cat_name in sorted(categories.keys()):
        print(f"  - {cat_name}: {len(categories[cat_name])} productos")

    print("\n" + "=" * 70)
    print("DETALLE POR CATEGORÍA:")
    print("=" * 70)

    for cat_name in sorted(categories.keys()):
        prods = categories[cat_name]
        print(f"\n📂 {cat_name.upper()} ({len(prods)} productos):")
        print("-" * 60)
        for p in prods:
            name = p.get("name", "?")
            is_active = p.get("isActive", True)
            price = p.get("price", 0)
            
            # Intentar obtener precio de locationsStock si price es 0
            if price == 0 and p.get("locationsStock"):
                for loc in p["locationsStock"]:
                    loc_price = loc.get("price", 0)
                    if loc_price > 0:
                        price = loc_price
                        break

            # Stock
            stock = "?"
            if p.get("locationsStock"):
                for loc in p["locationsStock"]:
                    for field in ["stock", "currentStock", "quantity"]:
                        if field in loc:
                            stock = loc[field]
                            break
                    if stock != "?":
                        break
            if stock == "?" and "stock" in p:
                stock = p["stock"]

            status = "✅ Activo" if is_active else "❌ Inactivo"
            print(f"  {status} | ${price:>10,.0f} | Stock: {str(stock):>6} | {name}")

    print("\n" + "=" * 70)
    print("ESTRUCTURA DEL PRIMER PRODUCTO (para debug):")
    print("=" * 70)
    if products:
        # Mostrar el primer producto de Bebidas si existe
        bebidas = categories.get("Bebidas", products[:1])
        sample = bebidas[0] if bebidas else products[0]
        print(f"Producto de muestra: {sample.get('name')}")
        print(json.dumps(sample, indent=2, ensure_ascii=False, default=str))
