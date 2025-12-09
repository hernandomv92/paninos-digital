"""
Guía para obtener la Connection String correcta de Supabase
"""

print("=" * 80)
print("CÓMO OBTENER LA CONNECTION STRING CORRECTA DE SUPABASE")
print("=" * 80)

print("""
PASO 1: Ve a tu Dashboard de Supabase
--------------------------------------
1. Abre: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a: Settings (⚙️) → Database

PASO 2: Encuentra la Connection String
---------------------------------------
1. Busca la sección "Connection string"
2. En el dropdown, selecciona: "URI"
3. IMPORTANTE: Cambia de "Transaction" a "Session"
4. Verás una URL como esta:

   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   
   Nota las diferencias clave:
   - Usa "postgres.[PROJECT-REF]" como usuario (NO solo "postgres")
   - El host es "aws-0-REGION.pooler.supabase.com" (NO "db.PROJECT.supabase.co")
   - Incluye ".pooler" en el dominio

PASO 3: Reemplazar [YOUR-PASSWORD]
-----------------------------------
En la URL que copiaste, verás [YOUR-PASSWORD] o similar.
Reemplázalo con tu contraseña real de Supabase.

Si no recuerdas tu contraseña:
1. En la misma página (Settings → Database)
2. Busca "Database Password"
3. Haz clic en "Reset Database Password"
4. Copia la nueva contraseña
5. Reemplázala en la URL

PASO 4: Actualizar tu archivo .env
-----------------------------------
Abre: backend/core/.env

Reemplaza la línea DATABASE_URL con la URL correcta:

DATABASE_URL=postgresql://postgres.xxxxx:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres

IMPORTANTE: 
- NO uses comillas
- NO agregues espacios
- Asegúrate de copiar la URL completa

PASO 5: Verificar
-----------------
Ejecuta:
   cd backend
   python check_db_config.py
   python manage.py migrate

""")

print("=" * 80)
print("EJEMPLO COMPLETO")
print("=" * 80)

print("""
Si tu proyecto se llama "paninos-db" y tu región es "us-east-1":

❌ INCORRECTO (lo que tienes ahora):
DATABASE_URL=postgresql://postgres:PaninosMigration2025@db.slgnuqvsjcjnprntdlmn.supabase.co:5432/postgres

✅ CORRECTO (lo que necesitas):
DATABASE_URL=postgresql://postgres.slgnuqvsjcjnprntdlmn:PaninosMigration2025@aws-0-us-east-1.pooler.supabase.com:5432/postgres

Diferencias clave:
1. Usuario: "postgres.slgnuqvsjcjnprntdlmn" (incluye el project ref)
2. Host: "aws-0-us-east-1.pooler.supabase.com" (incluye .pooler)
3. NO es "db.slgnuqvsjcjnprntdlmn.supabase.co"

""")

print("=" * 80)
print("¿POR QUÉ FALLÓ TU CONEXIÓN?")
print("=" * 80)

print("""
El error "password authentication failed" ocurrió porque:

1. Estás usando el formato de "Direct Connection" (puerto 5432 directo)
2. Pero con el host incorrecto (db.PROJECT.supabase.co)
3. Y el usuario incorrecto (solo "postgres" en vez de "postgres.PROJECT-REF")

Supabase requiere:
- Para conexiones directas: db.PROJECT.supabase.co:5432 con usuario "postgres"
- Para conexiones pooled (recomendado): aws-0-REGION.pooler.supabase.com:5432 con usuario "postgres.PROJECT-REF"

Django con psycopg2 funciona mejor con el Session Pooler.

""")

print("=" * 80)
