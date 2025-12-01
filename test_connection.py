import os
import requests
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def smoke_test():
    email = os.getenv("LOGGRO_EMAIL")
    password = os.getenv("LOGGRO_PASSWORD")

    if not email or not password:
        print("Error: LOGGRO_EMAIL or LOGGRO_PASSWORD not found in environment variables.")
        sys.exit(1)

    print(f"Attempting login with email: {email}")
    
    login_url = "https://api.pirpos.com/login"
    payload = {
        "email": email,
        "password": password
    }

    try:
        # Login
        print(f"POST {login_url}")
        response = requests.post(login_url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        token = data.get("tokenCurrent")
        
        if not token:
            print("Error: 'tokenCurrent' not found in login response.")
            print("Response:", data)
            sys.exit(1)
            
        print("Login successful. Token captured.")
        
        # Get Products
        products_url = "https://api.pirpos.com/products"
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        print(f"GET {products_url}")
        prod_response = requests.get(products_url, headers=headers)
        prod_response.raise_for_status()
        
        prod_data = prod_response.json()
        
        # Attempt to identify the list of products
        products = []
        if isinstance(prod_data, list):
            products = prod_data
        elif isinstance(prod_data, dict):
            if "data" in prod_data and isinstance(prod_data["data"], list):
                products = prod_data["data"]
            elif "results" in prod_data and isinstance(prod_data["results"], list):
                products = prod_data["results"]
            else:
                # Try to find any list in the dict
                for key, value in prod_data.items():
                    if isinstance(value, list):
                        products = value
                        break
        
        if products:
            print(f"Found {len(products)} products (or items). Listing first 3:")
            for i, prod in enumerate(products[:3]):
                # Try common name fields
                name = prod.get("name") or prod.get("nombre") or prod.get("title") or prod.get("description") or "Unknown Name"
                print(f"{i+1}. {name}")
        else:
            print("No products found or could not parse product list.")
            print("Response snippet:", str(prod_data)[:500])

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
             print("Response status code:", e.response.status_code)
             print("Response text:", e.response.text)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    smoke_test()
