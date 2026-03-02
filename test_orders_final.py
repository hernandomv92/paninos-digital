"""
Test final: crear pedido en Loggro con locationStock ID correcto.
Error anterior: "ubicacion de stock invalida" - faltaba el campo locationStock.
"""
import os, json, requests
from dotenv import load_dotenv
load_dotenv()

BASE = "https://api.pirpos.com"
# IDs confirmados de la BD real de Paninos
MESA_OSCAR    = "678ff8ebdaf361fce568200e"
MESA_CAJA     = "6769a9bd3feeb8457a7f512c"
SAND_ALOHA_ID = "6787210c1b0e7e0ac76839e8"
LOCATION_STOCK_ID = "6769a9bc3feeb8457a7f50f0"  # "General" - el unico almacen
CAJERO_ID     = "67872da9bca2d0f342a0a404"

def login():
    r = requests.post(f"{BASE}/login", json={
        "email": os.getenv("LOGGRO_EMAIL"),
        "password": os.getenv("LOGGRO_PASSWORD")
    })
    return r.json().get("tokenCurrent")

token = login()
H = {"Authorization": f"Bearer {token}"}
print("LOGIN OK")

# 1. Test: Pedido en mesa Oscar (pickup - recogida en tienda)
print("\n=== PEDIDO EN MESA OSCAR (pickup) ===")
payload_pickup = {
    "table": MESA_OSCAR,
    "groupName": "Pedido Web - Test Pickup",
    "orders": [
        {
            "product": SAND_ALOHA_ID,
            "quantity": 1,
            "unit_price": 14000,
            "locationStock": LOCATION_STOCK_ID,
            "notes": ["Sin cebolla - TEST WEB BORRAR"]
        }
    ]
}
r = requests.post(f"{BASE}/orders", json=payload_pickup, headers=H, timeout=15)
print(f"Status: {r.status_code}")
print(f"Response: {r.text[:600]}")
if r.status_code == 200:
    print("EXITO! Pedido creado en mesa Oscar")
    print(json.dumps(r.json(), indent=2, ensure_ascii=False)[:1000])

# 2. Test: Pedido delivery sin mesa
print("\n=== PEDIDO DELIVERY (domicilio sin mesa) ===")
payload_delivery = {
    "groupName": "Domicilio Web - Test Delivery",
    "seller": CAJERO_ID,
    "orders": [
        {
            "product": SAND_ALOHA_ID,
            "quantity": 1,
            "unit_price": 14000,
            "locationStock": LOCATION_STOCK_ID,
            "notes": ["Cra 5 # 12-34 - TEST WEB BORRAR"],
            "delivery": {"isDelivery": True}
        }
    ]
}
r2 = requests.post(f"{BASE}/orders", json=payload_delivery, headers=H, timeout=15)
print(f"Status: {r2.status_code}")
print(f"Response: {r2.text[:600]}")

# 3. Test con group=None (ver si lo crea automaticamente)
print("\n=== PEDIDO CAJA SIN group (ver si genera auto) ===")
payload_caja = {
    "table": MESA_CAJA,
    "groupName": "Pedido Web Caja Test",
    "orders": [
        {
            "product": SAND_ALOHA_ID,
            "quantity": 1,
            "unit_price": 14000,
            "locationStock": LOCATION_STOCK_ID,
        }
    ]
}
r3 = requests.post(f"{BASE}/orders", json=payload_caja, headers=H, timeout=15)
print(f"Status: {r3.status_code}")
print(f"Response: {r3.text[:600]}")
