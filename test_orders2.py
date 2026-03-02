import json, os, requests
from dotenv import load_dotenv
load_dotenv()
BASE = "https://api.pirpos.com"
MESA_OSCAR = "678ff8ebdaf361fce568200e"
SAND_ALOHA_ID = "6787210c1b0e7e0ac76839e8"
CAJERO_ID = "67872da9bca2d0f342a0a404"

token = requests.post(f"{BASE}/login", json={
    "email": os.getenv("LOGGRO_EMAIL"),
    "password": os.getenv("LOGGRO_PASSWORD")
}).json().get("tokenCurrent")
H = {"Authorization": f"Bearer {token}"}
print("LOGIN OK")

# Obtener estructura real de un pedido existente
r = requests.get(f"{BASE}/orders", headers=H, timeout=20)
orders = r.json() if isinstance(r.json(), list) else []
first = orders[0] if orders else {}
real_group = first.get("group")
table_field = first.get("table")
print(f"Total pedidos: {len(orders)}")
print(f"Group ID real: {real_group}")
print(f"Keys del pedido: {list(first.keys())}")
print(f"table type: {type(table_field).__name__} = {str(table_field)[:100]}")

# Guardar primer pedido para analizar
with open("C:/tmp/first_order.json", "w", encoding="utf-8") as f:
    json.dump(first, f, indent=2, ensure_ascii=False)
print("(primer pedido guardado en C:/tmp/first_order.json)")

# POST /orders con group ID real de la BD
print("\n=== POST /orders con group real ===")
payload = {
    "table": MESA_OSCAR,
    "group": real_group,
    "groupName": "Test Web Borrar",
    "orders": [{"product": SAND_ALOHA_ID, "quantity": 1, "unit_price": 14000, "notes": ["TEST BORRAR"]}]
}
r2 = requests.post(f"{BASE}/orders", json=payload, headers=H, timeout=15)
print(f"Status: {r2.status_code}")
print(f"Response: {r2.text[:600]}")

# POST sin group (para ver si lo genera automaticamente)
print("\n=== POST /orders sin group ===")
payload2 = {
    "table": MESA_OSCAR,
    "groupName": "Test Web Sin Group",
    "orders": [{"product": SAND_ALOHA_ID, "quantity": 1, "unit_price": 14000, "notes": ["TEST BORRAR"]}]
}
r3 = requests.post(f"{BASE}/orders", json=payload2, headers=H, timeout=15)
print(f"Status: {r3.status_code}")
print(f"Response: {r3.text[:600]}")
