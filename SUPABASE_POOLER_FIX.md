# Supabase Transaction Pooler Fix - Easypanel Deployment

## Problema Crítico Resuelto

### El Error Original
```
OperationalError: connection to server at "...supabase.co", port 5432 failed: Network is unreachable
```

### Causa Raíz
- **VPS de Easypanel**: Solo soporta IPv4
- **Puerto 5432 de Supabase**: IPv6-only (Direct Connection)
- **Puerto 6543 de Supabase**: IPv4 compatible (Transaction Pooler)
- **Problema**: Django ignoraba el puerto en `DATABASE_URL` o hacía fallback a 5432

## Solución Implementada

### Cambios en `backend/settings.py`

1. **Parseo Explícito de DATABASE_URL**: Ahora se lee la variable de entorno explícitamente
2. **Deshabilitación de Server-Side Cursors**: `DISABLE_SERVER_SIDE_CURSORS = True` (requerido para Transaction Pooler)
3. **Override de Puerto**: Si detecta puerto 5432, lo fuerza a 6543
4. **Opciones de Conexión**: Agrega `statement_timeout=60s` para compatibilidad con pooler
5. **Debug Output**: Imprime host y puerto al iniciar para verificación

### Configuración Requerida en Easypanel

Asegúrate de que tu variable de entorno `DATABASE_URL` esté configurada así:

```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Puntos Clave**:
- Usar `pooler.supabase.com` (NO el host directo)
- Puerto `6543` (NO 5432)
- Protocolo `postgresql://` (NO `postgres://`)

## Verificación Post-Deployment

Después de desplegar, verifica en los logs de Easypanel:

```
Database Config - Host: aws-0-us-east-1.pooler.supabase.com, Port: 6543
```

Si ves `Port: 5432`, hay un problema con la variable de entorno.

## Comandos de Deployment

```bash
# 1. Commit los cambios
git add backend/backend/settings.py SUPABASE_POOLER_FIX.md
git commit -m "fix(backend): force Supabase Transaction Pooler (port 6543) for IPv4 compatibility"

# 2. Push a producción
git push origin main

# 3. En Easypanel, rebuild el contenedor
# (Easypanel debería auto-deployar si tienes CI/CD configurado)
```

## Troubleshooting

### Si sigue fallando:

1. **Verifica la variable de entorno en Easypanel**:
   - Ve a tu app → Settings → Environment Variables
   - Confirma que `DATABASE_URL` tiene el puerto 6543

2. **Rebuild forzado**:
   - En Easypanel, haz un "Rebuild" manual del contenedor
   - Esto asegura que tome las nuevas variables de entorno

3. **Verifica los logs**:
   - Busca la línea `Database Config - Host: ..., Port: ...`
   - Debe mostrar `Port: 6543`

### Si el puerto sigue siendo 5432:

Esto significa que `DATABASE_URL` no está configurada correctamente. Opciones:

1. **Hardcodear temporalmente** (solo para emergencia):
   ```python
   # En settings.py, reemplaza DATABASE_URL = os.environ.get('DATABASE_URL', '') con:
   DATABASE_URL = 'postgresql://postgres.xxxxx:[TU_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
   ```

2. **Verificar sintaxis en Easypanel**:
   - Asegúrate de que no haya espacios extras
   - Verifica que no esté usando comillas dobles en la variable

## Notas Técnicas

- **Transaction Pooler** usa PgBouncer en modo "transaction"
- **Server-side cursors** no son compatibles con PgBouncer
- **Connection pooling** mejora el rendimiento en producción
- **IPv4 vs IPv6**: El pooler soporta ambos, pero el directo solo IPv6
