"""
Script de diagnóstico para verificar la configuración de la base de datos
"""
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

print("=" * 60)
print("DIAGNÓSTICO DE CONFIGURACIÓN DE BASE DE DATOS")
print("=" * 60)

# Verificar si DATABASE_URL está configurada
database_url = os.environ.get('DATABASE_URL')

if database_url:
    print("\n✅ DATABASE_URL está configurada")
    
    # Mostrar URL ofuscada (ocultar contraseña)
    if '@' in database_url:
        parts = database_url.split('@')
        if ':' in parts[0]:
            user_pass = parts[0].split('://')[-1]
            if ':' in user_pass:
                user, password = user_pass.split(':', 1)
                masked_url = database_url.replace(password, '*' * len(password))
                print(f"   URL (contraseña oculta): {masked_url}")
            else:
                print(f"   URL: {database_url}")
        else:
            print(f"   URL: {database_url}")
    else:
        print(f"   URL: {database_url}")
    
    # Verificar formato
    if database_url.startswith('postgresql://'):
        print("   ✅ Formato correcto (postgresql://)")
    elif database_url.startswith('postgres://'):
        print("   ⚠️  Formato antiguo (postgres://), se recomienda usar postgresql://")
    else:
        print("   ❌ Formato incorrecto, debe empezar con postgresql://")
    
    # Verificar componentes
    if '@' in database_url and ':' in database_url:
        print("   ✅ Contiene usuario y contraseña")
    else:
        print("   ❌ Falta usuario o contraseña")
    
    if '.supabase.co' in database_url:
        print("   ✅ Es una URL de Supabase")
    else:
        print("   ⚠️  No parece ser una URL de Supabase")
    
else:
    print("\n❌ DATABASE_URL NO está configurada")
    print("   Se usará SQLite por defecto")

# Verificar otras variables
print("\n" + "=" * 60)
print("OTRAS VARIABLES DE ENTORNO")
print("=" * 60)

django_debug = os.environ.get('DJANGO_DEBUG', 'False')
print(f"\nDJANGO_DEBUG: {django_debug}")

django_secret_key = os.environ.get('DJANGO_SECRET_KEY')
if django_secret_key:
    print(f"DJANGO_SECRET_KEY: {'*' * 20} (configurada)")
else:
    print("DJANGO_SECRET_KEY: ⚠️  No configurada (se usará la por defecto)")

allowed_hosts = os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1')
print(f"DJANGO_ALLOWED_HOSTS: {allowed_hosts}")

print("\n" + "=" * 60)
print("RECOMENDACIONES")
print("=" * 60)

if not database_url:
    print("\n1. Para usar Supabase, configura DATABASE_URL en tu archivo .env")
    print("   Formato: postgresql://postgres.REF:PASSWORD@HOST:5432/postgres")
    print("\n2. Para desarrollo local, puedes dejar DATABASE_URL sin configurar")
    print("   Django usará SQLite automáticamente")
else:
    print("\n1. Verifica que la contraseña sea correcta en Supabase")
    print("2. Asegúrate de usar el puerto 5432 (no 6543)")
    print("3. Copia la 'Connection string' desde Supabase → Settings → Database")
    print("4. Usa el modo 'Session' (no 'Transaction')")

print("\n" + "=" * 60)
