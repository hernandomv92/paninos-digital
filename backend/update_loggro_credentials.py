"""
Script para actualizar .env con credenciales de Loggro
"""
from pathlib import Path

# Credenciales proporcionadas
LOGGRO_EMAIL = "viviana.guevara.93@hotmail.com"
LOGGRO_PASSWORD = "Bastian123"
LOGGRO_API_URL = "https://api.pirpos.com/"

# Ruta al archivo .env
env_file = Path(__file__).parent / ".env"

print("=" * 80)
print("ACTUALIZANDO CREDENCIALES DE LOGGRO")
print("=" * 80)

# Leer contenido actual
current_content = ""
if env_file.exists():
    with open(env_file, 'r', encoding='utf-8') as f:
        current_content = f.read()

# Agregar credenciales de Loggro
new_content = current_content.strip() + "\n\n"
new_content += "# Loggro API Credentials\n"
new_content += f"LOGGRO_EMAIL={LOGGRO_EMAIL}\n"
new_content += f"LOGGRO_PASSWORD={LOGGRO_PASSWORD}\n"
new_content += f"LOGGRO_API_URL={LOGGRO_API_URL}\n"

# Guardar archivo
with open(env_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n✅ Credenciales de Loggro agregadas al archivo .env")
print(f"   Email: {LOGGRO_EMAIL}")
print(f"   API URL: {LOGGRO_API_URL}")
print("\n" + "=" * 80)
print("Listo para sincronizar el menú")
print("=" * 80)
