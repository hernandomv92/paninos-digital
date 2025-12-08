# Frontend - Restobar Digital Menu

Frontend desarrollado en **Next.js 14+** con **App Router** y **Tailwind CSS** para el sistema de pedidos digital integrado con Loggro Restobar POS.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 16.0.6 (App Router)
- **Lenguaje**: JavaScript (ES6+)
- **Estilos**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Linter**: ESLint

## 📁 Estructura del Proyecto

```
frontend/
├── app/
│   ├── layout.js          # Layout principal de la aplicación
│   ├── page.js            # Página principal (Home)
│   └── globals.css        # Estilos globales con Tailwind
├── components/
│   └── Menu.jsx           # Componente principal del menú
├── lib/
│   └── api.js             # Cliente Axios configurado
├── public/                # Archivos estáticos
├── next.config.js         # Configuración de Next.js
└── package.json           # Dependencias del proyecto
```

## 🎨 Características del Diseño

### Mobile First
- Diseño optimizado para dispositivos móviles (tráfico de Instagram/Facebook)
- Grid responsivo que se adapta a diferentes tamaños de pantalla
- Tarjetas de productos con hover effects y animaciones suaves

### Estética Premium
- **Gradientes vibrantes**: Fondo degradado de slate-900 a purple-900
- **Glassmorphism**: Efectos de vidrio esmerilado con backdrop-blur
- **Animaciones**: Transiciones suaves en hover, loading spinners
- **Bordes luminosos**: Efectos de brillo en hover con gradientes
- **Tipografía moderna**: Sistema de fuentes optimizado

### Componentes Visuales
- **Loading State**: Spinner animado con mensaje
- **Error State**: Tarjeta con diseño glassmorphic
- **Product Cards**: 
  - Imagen con overlay gradiente
  - Placeholder SVG para productos sin imagen
  - Información de precio con formato colombiano
  - Badge de disponibilidad (Disponible/Agotado)
  - Efectos hover con scale y shadow

## 🔌 Integración con Backend

### Endpoint Principal
```javascript
GET http://127.0.0.1:8000/api/menu/
```

### Estructura de Datos Esperada
```json
[
  {
    "id": 1,
    "name": "Categoría",
    "products": [
      {
        "id": 1,
        "name": "Producto",
        "description": "Descripción del producto",
        "price": "15000.00",
        "original_price": "18000.00",
        "image_url": "https://...",
        "is_available": true
      }
    ]
  }
]
```

## 🛠️ Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ instalado
- Backend Django corriendo en `http://127.0.0.1:8000`

### Comandos

```bash
# Desarrollo (puerto 3000)
npm run dev

# Build de producción
npm build

# Ejecutar build de producción
npm start

# Linter
npm run lint
```

## 🌐 URLs

- **Desarrollo**: http://localhost:3000
- **API Backend**: http://127.0.0.1:8000/api/

## 📝 Notas Técnicas

### Cliente API (lib/api.js)
- Configurado con baseURL del backend Django
- Headers por defecto: `Content-Type: application/json`
- Listo para agregar interceptors de autenticación si es necesario

### Componente Menu (components/Menu.jsx)
- **'use client'**: Componente del lado del cliente para usar hooks
- **useEffect**: Carga datos al montar el componente
- **useState**: Maneja estados de loading, error y datos
- **Manejo de errores**: Try-catch con mensajes amigables
- **Imágenes null**: Muestra placeholder SVG cuando `image_url` es null

### Optimizaciones
- Lazy loading de imágenes
- Transiciones CSS optimizadas con GPU (transform, opacity)
- Grid responsivo con breakpoints de Tailwind
- Sticky header con backdrop-blur

## 🎯 Próximos Pasos

1. ✅ Componente Menu funcionando
2. 🔄 Agregar carrito de compras
3. 🔄 Integración con WhatsApp para pedidos
4. 🔄 Sistema de autenticación si es necesario
5. 🔄 Polling cada 5 minutos para sincronizar menú

## 🐛 Troubleshooting

### Error de CORS
Si ves errores de CORS, asegúrate de que Django tenga configurado:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Imágenes no cargan
Verifica que las URLs de las imágenes sean accesibles públicamente o configura Next.js para permitir el dominio:
```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['tu-dominio.com'],
  },
};
```

---

**Desarrollado con ❤️ siguiendo las especificaciones de AGENTS.md**
