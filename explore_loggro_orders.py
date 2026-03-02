"""
Explorar el flujo real de Loggro con la documentacion oficial.
Endpoints: POST /orders requiere: table, group, groupName, orders[]
"""
import os, json, requests
from dotenv import load_dotenv

load_dotenv()
BASE = "https://api.pirpos.com"
email = os.getenv("LOGGRO_EMAIL")
password = os.getenv("LOGGRO_PASSWORD")

def login():
    r = requests.post(f"{BASE}/login", json={"email": email, "password": password})
    token = r.json().get("tokenCurrent")
    print(f"Login OK")
    return token

def run(token):
    H = {"Authorization": f"Bearer {token}"}

    # 1. Obtener mesas agrupadas por estado de pedido (doc: GET /tables por estado)
    print("\n===== GET /tables (estado de mesas) =====")
    r = requests.get(f"{BASE}/tables", headers=H)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        tables = data if isinstance(data, list) else data.get("data", [])
        for t in tables:
            print(f"  ID: {t.get('_id')} | Nombre: {t.get('name')} | Estado: {t.get('state') or t.get('status') or t.get('orderState')}")
        with open("C:/tmp/tables.json", "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    # 2. Consultar todos los pedidos activos (doc: GET /orders)
    print("\n===== GET /orders (pedidos activos) =====")
    r = requests.get(f"{BASE}/orders", headers=H)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        orders = data if isinstance(data, list) else data.get("data", [])
        print(f"  Pedidos encontrados: {len(orders)}")
        if orders:
            o = orders[0]
            print(f"  Primer pedido keys: {list(o.keys())}")
            print(f"  Ejemplo: {json.dumps(o, indent=2, ensure_ascii=False)[:1000]}")
            # Extraer groups y tables
            for o in orders[:5]:
                print(f"  group={o.get('group')} | table={o.get('table')} | groupName={o.get('groupName')}")
        with open("C:/tmp/orders.json", "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    else:
        print(f"  Error: {r.text[:300]}")

    # 3. Obtener grupos de pedidos por estado (doc sidebar)
    print("\n===== GET /orders/groups =====")
    for ep in ["/orders/groups", "/orders/group", "/groups", "/orders?state=pending"]:
        r2 = requests.get(f"{BASE}{ep}", headers=H, timeout=5)
        print(f"  {ep} -> {r2.status_code} | {r2.text[:200]}")

    # 4. Obtener pedidos en espera del negocio actual
    print("\n===== GET /orders/pending =====")
    for ep in ["/orders/pending", "/orders/waiting", "/orders/kitchen", "/orders/status/pending"]:
        r2 = requests.get(f"{BASE}{ep}", headers=H, timeout=5)
        print(f"  {ep} -> {r2.status_code} | {r2.text[:200]}")

    # 5. Extraer IDs de mesas de facturas existentes
    print("\n===== MESAS DE FACTURAS RECIENTES =====")
    r = requests.get(f"{BASE}/invoices", headers=H)
    invoices = r.json() if r.status_code == 200 else []
    mesas = {}
    groups = {}
    for inv in invoices:
        t = inv.get("table", {})
        if t.get("name"):
            mesas[t["name"]] = t.get("idInternal")
        g = inv.get("group")
        if g:
            groups[g] = inv.get("groupName", "")
    
    print(f"  Mesas conocidas: {mesas}")
    print(f"  Grupos (muestra): {dict(list(groups.items())[:5])}")

    # 6. Intentar crear pedido en mesa Oscar con formato correcto
    oscar_id = mesas.get("Oscar")
    caja_id = mesas.get("Caja")
    print(f"\n  Mesa Oscar ID: {oscar_id}")
    print(f"  Mesa Caja ID: {caja_id}")

    # Buscar SAND Aloha
    prods = requests.get(f"{BASE}/products", headers=H).json()
    prods = prods if isinstance(prods, list) else []
    sand = next((p for p in prods if "SAND Aloha" in p.get("name", "")), None)
    
    if oscar_id and sand:
        print(f"\n===== CREAR PEDIDO EN MESA OSCAR =====")
        print(f"  Producto: {sand.get('name')} | ID: {sand.get('_id')}")
        
        # Obtener precio real del producto
        loc_stock = sand.get("locationsStock", [{}])
        price = float(loc_stock[0].get("price", 0) if loc_stock else sand.get("price", 14000))
        if price == 0:
            price = 14000.0
        
        # Payload segun documentacion oficial
        payload = {
            "table": oscar_id,
            "group": oscar_id,  # En primer intento, group = table ID
            "groupName": "Pedido Web Test",
            "orders": [
                {
                    "product": sand.get("_id"),
                    "quantity": 1,
                    "unit_price": price,
                    "notes": ["Prueba desde web - Borrar"]
                }
            ]
        }
        
        print(f"  Payload: {json.dumps(payload, indent=2)}")
        r = requests.post(f"{BASE}/orders", json=payload, headers=H, timeout=10)
        print(f"  Status: {r.status_code}")
        print(f"  Response: {r.text[:500]}")

        # Probar sin group (solo table)
        print("\n  --- Sin group field ---")
        payload2 = {
            "table": oscar_id,
            "groupName": "Pedido Web Test 2",
            "orders": [{"product": sand.get("_id"), "quantity": 1, "unit_price": price}]
        }
        r2 = requests.post(f"{BASE}/orders", json=payload2, headers=H, timeout=10)
        print(f"  Status: {r2.status_code} | {r2.text[:300]}")

        # Probar entrega sin mesa (delivery)
        print("\n  --- Entrega sin mesa ---")
        seller_id = "67872da9bca2d0f342a0a404"  # Cajero
        payload3 = {
            "groupName": "Pedido Domicilio Web",
            "seller": seller_id,
            "orders": [
                {
                    "product": sand.get("_id"),
                    "quantity": 1,
                    "unit_price": price,
                    "delivery": {"isDelivery": True}
                }
            ]
        }
        r3 = requests.post(f"{BASE}/orders", json=payload3, headers=H, timeout=10)
        print(f"  Status: {r3.status_code} | {r3.text[:300]}")

if __name__ == "__main__":
    token = login()
    run(token)
    print("\n=== FIN ===")
