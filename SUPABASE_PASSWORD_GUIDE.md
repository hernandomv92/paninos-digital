# 🔐 Guía: Cómo Obtener la Contraseña Correcta de Supabase

## Paso 1: Acceder a tu Proyecto de Supabase

1. Ve a: https://supabase.com/dashboard
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto (el que creaste para Paninos)

## Paso 2: Ir a Configuración de Base de Datos

1. En el menú lateral izquierdo, haz clic en **"Settings"** (⚙️)
2. Luego haz clic en **"Database"**

## Paso 3: Obtener la Connection String

### Opción A: Ver la Contraseña Actual (si la guardaste)

1. Busca la sección **"Connection string"**
2. Selecciona el modo **"URI"**
3. Cambia de **"Transaction"** a **"Session"**
4. Copia la URL completa que aparece

La URL se verá así:
```
postgresql://postgres.PROJECT_REF:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Opción B: Resetear la Contraseña (si no la recuerdas)

1. En la misma página de **Settings → Database**
2. Busca la sección **"Database Password"**
3. Haz clic en **"Reset Database Password"**
4. Supabase generará una nueva contraseña
5. **¡IMPORTANTE!** Copia y guarda esta contraseña inmediatamente
6. Actualiza tu archivo `.env` con la nueva contraseña

## Paso 4: Actualizar el Archivo .env

Abre el archivo `backend/core/.env` y actualiza la línea:

```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:TU_NUEVA_CONTRASEÑA@db.slgnuqvsjcjnprntdlmn.supabase.co:5432/postgres
```

**Reemplaza `TU_NUEVA_CONTRASEÑA` con la contraseña que copiaste de Supabase**

## Paso 5: Verificar la Conexión

Ejecuta el script de diagnóstico nuevamente:

```bash
cd backend
python check_db_config.py
```

Si todo está correcto, deberías ver:
- ✅ DATABASE_URL está configurada
- ✅ Formato correcto (postgresql://)
- ✅ Contiene usuario y contraseña
- ✅ Es una URL de Supabase

## Paso 6: Ejecutar Migraciones

```bash
python manage.py migrate
```

Si la contraseña es correcta, las migraciones se ejecutarán sin errores.

---

## 🚨 Problemas Comunes

### Error: "password authentication failed"
- **Causa**: La contraseña en el `.env` no coincide con la de Supabase
- **Solución**: Resetea la contraseña en Supabase y actualiza el `.env`

### Error: "connection refused"
- **Causa**: Puerto incorrecto o firewall bloqueando la conexión
- **Solución**: Verifica que uses el puerto `5432` (no `6543`)

### Error: "SSL required"
- **Causa**: Supabase requiere conexión SSL
- **Solución**: Asegúrate de que la URL termine con `?sslmode=require` o que Django esté configurado para usar SSL

---

## 💡 Alternativa: Usar SQLite para Desarrollo Local

Si solo quieres desarrollar localmente sin Supabase:

1. Comenta la línea `DATABASE_URL` en tu `.env`:
   ```env
   # DATABASE_URL=postgresql://...
   ```

2. Django usará SQLite automáticamente (archivo `db.sqlite3`)

3. Para producción, descomenta y configura Supabase correctamente

---

## 📞 ¿Necesitas Ayuda?

Si sigues teniendo problemas:
1. Verifica que tu proyecto de Supabase esté activo
2. Revisa que no haya espacios extra en la URL
3. Asegúrate de copiar la contraseña completa (sin espacios al inicio o final)
4. Prueba resetear la contraseña en Supabase
