"""
Script para actualizar DATABASE_URL con la nueva contraseña
"""
import os
from pathlib import Path

# Nueva URL de conexión con contraseña reseteada
NEW_DATABASE_URL = "postgresql://postgres:PaninosReset2025@db.slgnuqvsjcjnprntdlmn.supabase.co:5432/postgres"

# Ruta al archivo .env
env_file = Path(__file__).parent / ".env"

print("=" * 80)
print("ACTUALIZANDO CONFIGURACIÓN DE BASE DE DATOS")
print("=" * 80)

# Crear o sobrescribir el archivo .env
with open(env_file, 'w', encoding='utf-8') as f:
    f.write(f"DATABASE_URL={NEW_DATABASE_URL}\n")

print(f"\n✅ Archivo .env actualizado: {env_file}")
print(f"✅ Nueva contraseña: PaninosReset2025")
print(f"✅ Conexión: Direct Connection (puerto 5432)")

print("\n" + "=" * 80)
print("PRÓXIMO PASO: EJECUTAR MIGRACIONES")
print("=" * 80)
print("\nEjecutando: python manage.py migrate")
print("=" * 80)
