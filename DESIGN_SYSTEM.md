# 🎨 Sistema de Diseño - Color Layering

## 📐 Principios Implementados

### Color Layering for Depth (Sin Bordes)
Creamos profundidad visual usando **únicamente capas de color y sombras**, sin necesidad de bordes.

## 🎯 Sistema de Capas

### Jerarquía de Colores (Oscuro → Claro)
```css
layer-base:     #0a0a0a  ← Más profundo (fondo)
layer-low:      #141414  ← +0.1 luminosidad
layer-mid:      #1e1e1e  ← +0.2 luminosidad  
layer-high:     #282828  ← +0.3 luminosidad
layer-elevated: #323232  ← Más elevado (elementos importantes)
```

### Principio de Jerarquía Visual
- **Más oscuro** = Más profundo/Background
- **Más claro** = Más elevado/Importante
- **Stack layers**: Capa clara sobre capa oscura = Elevación

## 🌟 Sistema de Sombras

### Sombras por Profundidad
```css
shadow-layer-sm:  Elementos ligeramente elevados (iconos)
shadow-layer-md:  Contenedores intermedios
shadow-layer-lg:  Contenedores principales
shadow-layer-xl:  Elementos muy destacados

shadow-glow-red:    Hover con resplandor rojo
shadow-glow-yellow: Hover con resplandor amarillo
```

## 📱 Aplicación en Página de Bienvenida

### 1. Botón "Ver Carta"
**Estructura de capas (de atrás hacia adelante):**
```
layer-elevated (base del botón)
  └─ layer-high (capa intermedia)
      └─ Gradiente rojo/amarillo (hover)
          └─ Resplandor sutil
              └─ Texto (VER CARTA)
```

**Efectos:**
- Sin bordes
- Profundidad por capas de color
- Hover: Gradiente + glow-red
- Transición suave 500ms
- Escala del texto en hover

### 2. Sección "Síguenos"
**Estructura anidada:**
```
layer-mid (contenedor principal)
  shadow-layer-lg
    └─ layer-high (contenedor de iconos)
        shadow-layer-md
          └─ layer-elevated (cada icono)
              shadow-layer-sm
```

**Jerarquía visual:**
1. Fondo más oscuro (layer-mid)
2. Contenedor intermedio (layer-high) 
3. Iconos elevados (layer-elevated)
4. Hover: primary-red + glow-red

### 3. Iconos de Redes Sociales
**Efectos aplicados:**
- `w-14 h-14` - Tamaño más grande
- `bg-layer-elevated` - Color base elevado
- `hover:bg-primary-red` - Color en hover
- `rounded-2xl` - Bordes más redondeados
- `shadow-layer-sm` - Sombra base
- `hover:shadow-glow-red` - Resplandor en hover
- `hover:scale-110` - Escala 110%
- `hover:-translate-y-1` - Elevación 4px
- `duration-500` - Transición suave

## ✅ Ventajas del Sistema

1. **Sin bordes** - Look más limpio y moderno
2. **Profundidad natural** - Contraste de colores crea elevación
3. **Consistente** - Mismo sistema en toda la app
4. **Escalable** - Fácil agregar más capas
5. **Accesible** - Buen contraste visual
6. **Animaciones fluidas** - Transiciones de 500ms

## 🎨 Paleta de Colores

### Colores Principales
```
primary-red:    #e61d25  (Rojo característico)
primary-yellow: #fdb72d  (Amarillo cálido)
primary-green:  #38a169  (Verde fresco)
```

### Uso de Colores
- **Rojo**: Acciones principales, hover, destacados
- **Amarillo**: Acentos, gradientes
- **Capas**: Crear profundidad sin bordes

## 📏 Espaciado Consistente

### Padding
- Contenedor principal: `p-6`
- Contenedor secundario: `p-4`
- Espaciado entre iconos: `space-x-4`

### Margin
- Entre secciones: `mb-8`
- Entre elementos: `mb-5`, `mb-4`

## 🔄 Transiciones

### Tiempos
- Rápida: `duration-300` (clicks, pequeños cambios)
- Estándar: `duration-500` (hovers, transiciones)
- Suave: `duration-700` (cambios de página)

### Easing
- `ease-in-out`: Suave al inicio y final
- `cubic-bezier`: Movimientos naturales

## 🎯 Próximos Pasos

Aplicaremos este mismo sistema a:
1. ✅ Página de bienvenida (completado)
2. ⏳ Página de menú/productos
3. ⏳ Carrito de compras
4. ⏳ Panel de administración
5. ⏳ Modales y componentes

## 📝 Guía de Uso

### Para agregar un nuevo elemento elevado:
```jsx
<div className="bg-layer-mid rounded-2xl p-4 shadow-layer-md">
  <div className="bg-layer-high rounded-xl p-3 shadow-layer-sm">
    <button className="bg-layer-elevated hover:bg-primary-red 
                       shadow-layer-sm hover:shadow-glow-red
                       transition-all duration-500">
      Contenido
    </button>
  </div>
</div>
```

### Regla de oro:
**Cada capa debe ser más clara que la anterior**
**Nunca usar bordes, solo contraste y sombras**

---

**Implementado por**: Sistema de diseño profesional
**Fecha**: Octubre 2024
**Estado**: ✅ Página de bienvenida completada
