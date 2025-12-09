"""
Script para configurar el entorno de desarrollo local con SQLite
"""
import os
import shutil
from pathlib import Path

print("=" * 70)
print("CONFIGURACIÓN DE ENTORNO DE DESARROLLO LOCAL")
print("=" * 70)

# Ruta al archivo .env
env_file = Path(__file__).parent / "core" / ".env"
env_backup = Path(__file__).parent / "core" / ".env.backup"

if env_file.exists():
    print(f"\n✅ Archivo .env encontrado: {env_file}")
    
    # Crear backup
    if not env_backup.exists():
        shutil.copy(env_file, env_backup)
        print(f"✅ Backup creado: {env_backup}")
    
    # Leer contenido actual
    with open(env_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Modificar para desarrollo local
    new_lines = []
    database_url_commented = False
    django_debug_set = False
    
    for line in lines:
        if line.strip().startswith('DATABASE_URL='):
            # Comentar DATABASE_URL para usar SQLite
            new_lines.append(f"# {line}")
            database_url_commented = True
        elif line.strip().startswith('DJANGO_DEBUG='):
            # Asegurar que DEBUG esté en True para desarrollo
            new_lines.append('DJANGO_DEBUG=True\n')
            django_debug_set = True
        else:
            new_lines.append(line)
    
    # Agregar DJANGO_DEBUG si no existe
    if not django_debug_set:
        new_lines.append('\nDJANGO_DEBUG=True\n')
    
    # Escribir archivo modificado
    with open(env_file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("\n" + "=" * 70)
    print("CAMBIOS REALIZADOS")
    print("=" * 70)
    
    if database_url_commented:
        print("✅ DATABASE_URL comentada → Se usará SQLite")
    
    print("✅ DJANGO_DEBUG=True → Modo desarrollo activado")
    
    print("\n" + "=" * 70)
    print("PRÓXIMOS PASOS")
    print("=" * 70)
    print("\n1. Ejecutar migraciones:")
    print("   python manage.py migrate")
    print("\n2. Crear superusuario:")
    print("   python manage.py createsuperuser")
    print("\n3. Iniciar servidor de desarrollo:")
    print("   python manage.py runserver")
    print("\n4. Acceder a:")
    print("   - Frontend: http://localhost:3000")
    print("   - Backend: http://localhost:8000")
    print("   - Admin: http://localhost:8000/admin")
    
    print("\n" + "=" * 70)
    print("NOTA")
    print("=" * 70)
    print("\nPara volver a usar Supabase en producción:")
    print("1. Restaura el backup: copy core\\.env.backup core\\.env")
    print("2. Actualiza la contraseña correcta en DATABASE_URL")
    
else:
    print(f"\n❌ No se encontró el archivo .env en: {env_file}")
    print("\nCreando archivo .env para desarrollo local...")
    
    # Crear archivo .env básico
    env_content = """# Django Configuration (Desarrollo Local)
DJANGO_SECRET_KEY=dev-secret-key-change-in-production
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database - SQLite (comentar para usar Supabase)
# DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# Loggro API
LOGGRO_API_KEY=your-loggro-api-key
"""
    
    env_file.parent.mkdir(parents=True, exist_ok=True)
    with open(env_file, 'w', encoding='utf-8') as f:
        f.write(env_content)
    
    print(f"✅ Archivo .env creado: {env_file}")
    print("\nAhora puedes ejecutar:")
    print("   python manage.py migrate")

print("\n" + "=" * 70)
