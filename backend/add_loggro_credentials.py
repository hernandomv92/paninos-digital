"""
Script para agregar credenciales de Loggro al archivo .env de forma interactiva
"""
from pathlib import Path
import getpass

# Ruta al archivo .env
env_file = Path(__file__).parent / ".env"

print("=" * 80)
print("CONFIGURACIÓN DE CREDENCIALES DE LOGGRO")
print("=" * 80)

# Leer contenido actual
current_lines = []
if env_file.exists():
    with open(env_file, 'r', encoding='utf-8') as f:
        current_lines = f.readlines()

# Verificar si ya existen las credenciales
has_email = any('LOGGRO_EMAIL' in line for line in current_lines)
has_password = any('LOGGRO_PASSWORD' in line for line in current_lines)

if has_email and has_password:
    print("\n✅ Las credenciales de Loggro ya están configuradas.")
    print("\n¿Deseas actualizarlas? (s/n): ", end='')
    response = input().strip().lower()
    if response != 's':
        print("\nCancelado. Credenciales no modificadas.")
        exit(0)
    # Remover líneas existentes
    current_lines = [line for line in current_lines if 'LOGGRO_EMAIL' not in line and 'LOGGRO_PASSWORD' not in line]

print("\nPor favor, ingresa tus credenciales de Loggro:")
print("(Estas se guardarán en backend/.env)")

# Solicitar credenciales
email = input("\nEmail de Loggro: ").strip()
password = getpass.getpass("Contraseña de Loggro: ").strip()

if not email or not password:
    print("\n❌ Error: Email y contraseña son obligatorios.")
    exit(1)

# Agregar nuevas credenciales
new_content = ''.join(current_lines)
if not new_content.endswith('\n') and new_content:
    new_content += '\n'

new_content += f"\n# Loggro API Credentials\n"
new_content += f"LOGGRO_EMAIL={email}\n"
new_content += f"LOGGRO_PASSWORD={password}\n"

# Guardar archivo
with open(env_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n" + "=" * 80)
print("✅ CREDENCIALES GUARDADAS EXITOSAMENTE")
print("=" * 80)
print(f"\nArchivo actualizado: {env_file}")
print(f"Email configurado: {email}")
print(f"Contraseña: {'*' * len(password)}")

print("\n" + "=" * 80)
print("PRÓXIMO PASO")
print("=" * 80)
print("\nAhora puedes sincronizar el menú ejecutando:")
print("   python manage.py sync_menu")
print("\n" + "=" * 80)
