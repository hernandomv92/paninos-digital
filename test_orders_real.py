"""
Test directo: crear pedido en Loggro con el formato correcto segun documentacion oficial.
POST /orders con: table, group, groupName, orders[]
"""
import os, json, requests
from dotenv import load_dotenv

load_dotenv()
BASE = "https://api.pirpos.com"

# IDs confirmados
MESA_OSCAR = "678ff8ebdaf361fce568200e"
MESA_CAJA  = "6769a9bd3feeb8457a7f512c"
SAND_ALOHA_ID = "6787210c1b0e7e0ac76839e8"  # confirmed from products
CAJERO_ID = "67872da9bca2d0f342a0a404"

token = requests.post(f"{BASE}/login", json={
    "email": os.getenv("LOGGRO_EMAIL"),
    "password": os.getenv("LOGGRO_PASSWORD")
}).json().get("tokenCurrent")
H = {"Authorization": f"Bearer {token}"}

print("LOGIN OK\n")

# --- GET /orders: consultar pedidos actuales ---
print("=== GET /orders ===")
r = requests.get(f"{BASE}/orders", headers=H, timeout=15)
print(f"Status: {r.status_code}")
data = r.json()
if isinstance(data, list):
    print(f"Pedidos activos: {len(data)}")
    for o in data[:3]:
        print(f"  group={o.get('group')} | table={o.get('table')} | groupName={o.get('groupName')} | keys={list(o.keys())}")
elif isinstance(data, dict):
    print(f"Keys: {list(data.keys())}")
    print(json.dumps(data, indent=2, ensure_ascii=False)[:1000])

with open("C:/tmp/orders_active.json", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# --- Intentos de crear pedido con diferentes formatos de group ---
print("\n=== POST /orders - Intento 1: group=table (mesa Oscar) ===")
payload1 = {
    "table": MESA_OSCAR,
    "group": MESA_OSCAR,
    "groupName": "Test Web - borrar",
    "orders": [{"product": SAND_ALOHA_ID, "quantity": 1, "unit_price": 14000, "notes": ["TEST BORRAR"]}]
}
r1 = requests.post(f"{BASE}/orders", json=payload1, headers=H, timeout=15)
print(f"Status: {r1.status_code} | {r1.text[:400]}")

print("\n=== POST /orders - Intento 2: sin group (solo table) ===")
payload2 = {
    "table": MESA_OSCAR,
    "groupName": "Test Web 2 - borrar",
    "orders": [{"product": SAND_ALOHA_ID, "quantity": 1, "unit_price": 14000, "notes": ["TEST BORRAR"]}]
}
r2 = requests.post(f"{BASE}/orders", json=payload2, headers=H, timeout=15)
print(f"Status: {r2.status_code} | {r2.text[:400]}")

print("\n=== POST /orders - Intento 3: delivery sin mesa ===")
payload3 = {
    "groupName": "Domicilio Web - Test borrar",
    "seller": CAJERO_ID,
    "orders": [{"product": SAND_ALOHA_ID, "quantity": 1, "unit_price": 14000,
                "delivery": {"isDelivery": True}}]
}
r3 = requests.post(f"{BASE}/orders", json=payload3, headers=H, timeout=15)
print(f"Status: {r3.status_code} | {r3.text[:400]}")

print("\n=== POST /orders - Intento 4: Buscar group ID real de GET /orders/groups ===")
for ep in ["/orders/groups", "/orders/group", "/groups/orders"]:
    rg = requests.get(f"{BASE}{ep}", headers=H, timeout=8)
    print(f"  GET {ep} -> {rg.status_code} | {rg.text[:200]}")
