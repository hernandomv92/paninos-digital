"""
Script para agregar credenciales de Loggro al archivo .env
"""
from pathlib import Path

# Ruta al archivo .env
env_file = Path(__file__).parent / ".env"

print("=" * 80)
print("CONFIGURACIÓN DE CREDENCIALES DE LOGGRO")
print("=" * 80)

# Leer contenido actual
current_content = ""
if env_file.exists():
    with open(env_file, 'r', encoding='utf-8') as f:
        current_content = f.read()

# Agregar credenciales de Loggro si no existen
if "LOGGRO_EMAIL" not in current_content:
    print("\n⚠️  Se necesitan las credenciales de Loggro para sincronizar el menú.")
    print("\nPor favor, proporciona las siguientes credenciales:")
    print("1. Email de Loggro")
    print("2. Contraseña de Loggro")
    print("\nEstas credenciales se agregarán al archivo .env")
    print("\n" + "=" * 80)
else:
    print("\n✅ Las credenciales de Loggro ya están configuradas en .env")
    print("=" * 80)
