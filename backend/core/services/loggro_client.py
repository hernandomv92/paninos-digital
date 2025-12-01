import os
import requests
from django.conf import settings

class LoggroClient:
    def __init__(self):
        # Ideally, we should use Django settings or os.getenv. 
        # Since we are in a Django project, using os.getenv is fine, 
        # but we might want to move these to settings.py later.
        self.email = os.getenv("LOGGRO_EMAIL")
        self.password = os.getenv("LOGGRO_PASSWORD")
        self.base_url = "https://api.pirpos.com"
        self.token = None

    def _login(self):
        if not self.email or not self.password:
            raise ValueError("LOGGRO_EMAIL or LOGGRO_PASSWORD not set in environment.")

        url = f"{self.base_url}/login"
        payload = {
            "email": self.email,
            "password": self.password
        }
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            self.token = data.get("tokenCurrent")
            if not self.token:
                raise ValueError("Token not found in login response")
        except requests.RequestException as e:
            # In a real app, log this error
            print(f"Login failed: {e}")
            raise

    def get_products(self):
        if not self.token:
            self._login()

        url = f"{self.base_url}/products"
        headers = {
            "Authorization": f"Bearer {self.token}"
        }

        try:
            response = requests.get(url, headers=headers)
            
            # If token expired (401), retry login once
            if response.status_code == 401:
                self._login()
                headers["Authorization"] = f"Bearer {self.token}"
                response = requests.get(url, headers=headers)

            response.raise_for_status()
            data = response.json()
            
            # Normalize data return
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                if "data" in data and isinstance(data["data"], list):
                    return data["data"]
                elif "results" in data and isinstance(data["results"], list):
                    return data["results"]
                # Fallback search for list
                for val in data.values():
                    if isinstance(val, list):
                        return val
            
            return []
            
        except requests.RequestException as e:
            print(f"Get products failed: {e}")
            raise
