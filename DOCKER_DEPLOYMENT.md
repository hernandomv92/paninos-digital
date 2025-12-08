# 🐳 Docker Deployment Guide - Paninos Digital

## 📋 Requisitos Previos

- Docker instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)
- Cuenta en Supabase (para base de datos PostgreSQL)

## 🚀 Despliegue Rápido

### Opción 1: Usando Docker Compose (Recomendado para desarrollo)

1. **Clonar el repositorio y navegar al directorio**
   ```bash
   cd Antigravity-Paninos
   ```

2. **Crear archivo `.env` en la raíz del proyecto**
   ```bash
   # Backend
   DJANGO_SECRET_KEY=your-super-secret-key-change-this
   DJANGO_DEBUG=False
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
   
   # Frontend
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Construir y levantar los servicios**
   ```bash
   docker-compose up --build
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

### Opción 2: Construcción Individual

#### Backend

```bash
cd backend

# Construir imagen
docker build -t paninos-backend .

# Ejecutar contenedor
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e DJANGO_SECRET_KEY="your-secret-key" \
  -e DJANGO_ALLOWED_HOSTS="localhost,127.0.0.1" \
  paninos-backend
```

#### Frontend

```bash
cd frontend

# Construir imagen
docker build -t paninos-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:8000" \
  paninos-frontend
```

## 🗄️ Configuración de Supabase

1. **Crear proyecto en Supabase**
   - Ve a https://supabase.com
   - Crea un nuevo proyecto
   - Anota las credenciales de conexión

2. **Obtener la URL de conexión**
   - En tu proyecto de Supabase, ve a Settings > Database
   - Copia la "Connection string" en modo "Session"
   - Formato: `postgresql://postgres.[ref]:[password]@[host]:6543/postgres?sslmode=require`

3. **Configurar en el archivo `.env`**
   ```bash
   DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```

## 📦 Optimizaciones de Producción

### Backend (Django)
- ✅ Usa Gunicorn como servidor WSGI
- ✅ WhiteNoise para servir archivos estáticos
- ✅ Imagen basada en `python:3.11-slim-bullseye` (~350-450 MB)
- ✅ Variables de entorno para configuración
- ✅ Health checks configurados

### Frontend (Next.js)
- ✅ Multi-stage build (3 etapas)
- ✅ Modo standalone (reduce tamaño ~80%)
- ✅ Imagen basada en `node:18-alpine` (~150-200 MB)
- ✅ Usuario no-root para seguridad
- ✅ Solo archivos necesarios en imagen final

## 🔧 Comandos Útiles

### Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### Ejecutar migraciones
```bash
docker-compose exec backend python manage.py migrate
```

### Crear superusuario
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Sincronizar menú desde Loggro
```bash
docker-compose exec backend python manage.py sync_menu
```

### Detener servicios
```bash
docker-compose down
```

### Limpiar todo (incluyendo volúmenes)
```bash
docker-compose down -v
```

## 🌐 Despliegue en Plataformas Cloud

### Railway
1. Conecta tu repositorio de GitHub
2. Crea dos servicios: uno para backend y otro para frontend
3. Configura las variables de entorno
4. Railway detectará automáticamente los Dockerfiles

### Render
1. Crea un "Web Service" para backend
2. Crea otro "Web Service" para frontend
3. Configura las variables de entorno
4. Render construirá usando los Dockerfiles

### Google Cloud Run / AWS ECS / Azure Container Instances
1. Construye las imágenes localmente
2. Sube a un registro de contenedores (GCR, ECR, ACR)
3. Despliega desde el registro
4. Configura variables de entorno en la plataforma

## 🔒 Seguridad

- ✅ No incluir archivos `.env` en el repositorio
- ✅ Usar `.dockerignore` para excluir archivos sensibles
- ✅ Cambiar `DJANGO_SECRET_KEY` en producción
- ✅ Configurar `DJANGO_ALLOWED_HOSTS` correctamente
- ✅ Usar HTTPS en producción
- ✅ Habilitar SSL en conexión a base de datos

## 📊 Tamaños de Imagen Estimados

| Servicio | Tamaño Aproximado |
|----------|-------------------|
| Backend  | ~350-450 MB       |
| Frontend | ~150-200 MB       |
| **Total**| **~500-650 MB**   |

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que Supabase permita conexiones desde tu IP

### Error: "Static files not found"
- Ejecuta `docker-compose exec backend python manage.py collectstatic`

### Frontend no se conecta al backend
- Verifica que `NEXT_PUBLIC_API_URL` apunte a la URL correcta del backend
- En producción, usa la URL pública del backend

## 📞 Soporte

Para más información, consulta la documentación oficial:
- [Docker](https://docs.docker.com/)
- [Django Deployment](https://docs.djangoproject.com/en/stable/howto/deployment/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase](https://supabase.com/docs)
