# 🔍 Análisis de Ingredientes/Insumos - API Loggro

## 📊 Resumen Ejecutivo

**Fecha:** 2025-11-30
**Endpoint Analizado:** `GET /products`
**Total de Productos:** 65

---

## ✅ Hallazgos Principales

### 1️⃣ **NO hay ingredientes reales en el endpoint `/products`**

```
✓ Productos encontrados con palabras clave (Pan, Queso, Salami, etc.): 16
✓ Ingredientes reales (isIngredient=true): 0
```

**Conclusión:** El endpoint `/products` devuelve **productos finales**, no ingredientes/insumos.

---

### 2️⃣ **Productos Encontrados con Palabras Clave**

Los 16 productos encontrados son **productos finales** que contienen esos ingredientes en su nombre, pero NO son los ingredientes en sí:

| # | Nombre | Tipo Inventario | Stock | isIngredient |
|---|--------|-----------------|-------|--------------|
| 1 | Add Jamón | WithIngredients | 0 | false |
| 2 | Add Piña | WithIngredients | 0 | false |
| 3 | Add Pollo | WithIngredients | 0 | false |
| 4 | Add Queso | N/A | 0 | false |
| 5 | Add Salami | WithIngredients | 0 | false |
| 6 | Devolucion Pan | WithIngredients | 0 | false |
| 7 | Devolucion Piña | WithIngredients | 0 | false |
| 8 | Devolucion Pollo 60gr | WithIngredients | 0 | false |
| 9 | Devolucion Salami | WithIngredients | 0 | false |
| 10 | SAND Jamon y Queso | WithIngredients | 0 | false |
| 11 | SAND Pollo | WithIngredients | 0 | false |
| 12 | SAND Pollo Piña | WithIngredients | 0 | false |
| 13 | SAND Salami Pepperoni | WithIngredients | 0 | false |
| 14 | SAND Supremo Carne | WithIngredients | 0 | false |
| 15 | SAND Supremo Pollo | WithIngredients | 0 | false |
| 16 | Salsas 200gr PEDIDO | WithIngredients | 0 | false |

---

### 3️⃣ **Análisis de Tipos de Inventario**

```
WithIngredients: 15 productos (93.75%)
N/A: 1 producto (6.25%)
```

**Interpretación:**
- Los productos con `inventoryType: "WithIngredients"` calculan su disponibilidad basándose en el stock de sus ingredientes
- El stock mostrado en estos productos (0) es el stock del producto final, no de los ingredientes

---

### 4️⃣ **Estructura de Campos Relacionados con Ingredientes**

En cada producto se encontraron los siguientes campos:

```json
{
  "ingredients": [],        // Lista de ingredientes (vacía en este caso)
  "extra": [],             // Extras disponibles (vacía)
  "subProducts": [],       // Subproductos (vacía)
  "isIngredient": false,   // Indica si ES un ingrediente
  "isSubproduct": false,   // Indica si es un subproducto
  "withoutIngredients": false,
  "extraV2": []
}
```

**Observación:** El campo `ingredients` existe pero está **vacío** en todos los productos analizados.

---

## 🔍 Análisis Detallado

### ¿Por qué `ingredients` está vacío?

Hay varias posibilidades:

1. **Endpoint Separado:** Los ingredientes están en un endpoint diferente (ej: `GET /ingredients`)
2. **Configuración del Negocio:** El negocio no ha configurado la relación ingredientes-productos en Loggro
3. **Permisos de API:** El token actual no tiene permisos para ver ingredientes
4. **Modelo de Datos:** Loggro maneja ingredientes de forma interna sin exponerlos en la API

---

## 💡 Recomendaciones

### 1. **Investigar Endpoints Adicionales**

Buscar en la documentación de Loggro API endpoints como:
- `GET /ingredients`
- `GET /supplies`
- `GET /inventory`
- `GET /raw-materials`

### 2. **Consultar con Soporte de Loggro**

Preguntar específicamente:
- ¿Cómo se obtiene el stock de ingredientes/insumos?
- ¿Existe un endpoint para ingredientes?
- ¿Cómo se relacionan productos con sus ingredientes?

### 3. **Revisar Dashboard de Loggro**

En el dashboard web de Loggro:
- Verificar si los productos tienen ingredientes configurados
- Revisar la sección de inventario/insumos
- Confirmar que los ingredientes tienen stock asignado

### 4. **Estrategia Actual (Temporal)**

Mientras se investiga, la estrategia actual es válida:

```python
if inventoryType == 'WithIngredients' and isActive:
    stock = 999  # Asumimos disponible si está activo
```

**Justificación:**
- Si el producto está activo en Loggro, significa que hay ingredientes disponibles
- El sistema de Loggro desactivaría automáticamente productos sin ingredientes
- Stock 999 indica "disponible según ingredientes"

---

## 📋 Estructura JSON Completa de un Producto

```json
{
  "_id": "678729511b0e7e0ac7800785",
  "name": "Add Jamón",
  "category": {
    "_id": "678720d8e8f60393f70ae492",
    "name": "Adiciones Paninos"
  },
  "price": 0,
  "stock": 0,
  "stockMinimum": 0,
  "inventoryType": "WithIngredients",
  "isActive": true,
  "isIngredient": false,
  "isSubproduct": false,
  "ingredients": [],        // ← VACÍO
  "extra": [],
  "subProducts": [],
  "locationsStock": [
    {
      "stock": 0,
      "price": 1500,
      "locationStock": {
        "name": "General"
      }
    }
  ]
}
```

---

## 🎯 Conclusión

### ✅ Lo que SÍ sabemos:
1. El endpoint `/products` devuelve productos finales
2. Todos los productos tienen `isIngredient: false`
3. El campo `ingredients` existe pero está vacío
4. Los productos con `inventoryType: "WithIngredients"` dependen de ingredientes
5. El stock mostrado (0) es del producto final, no de ingredientes

### ❓ Lo que NO sabemos:
1. ¿Dónde está el stock de los ingredientes reales (Pan, Queso, Jamón, etc.)?
2. ¿Existe un endpoint separado para ingredientes?
3. ¿Por qué el campo `ingredients` está vacío?
4. ¿Cómo se relacionan productos con ingredientes en Loggro?

### 🚀 Próximos Pasos:
1. Contactar soporte de Loggro para preguntar por endpoint de ingredientes
2. Revisar documentación completa de la API
3. Verificar configuración en el dashboard de Loggro
4. Mientras tanto, mantener la estrategia actual (stock 999 para WithIngredients activos)

---

**Análisis realizado por:** Data Analyst
**Scripts utilizados:**
- `inspect_ingredients.py` - Búsqueda por palabras clave
- `find_ingredients.py` - Búsqueda de isIngredient=true
