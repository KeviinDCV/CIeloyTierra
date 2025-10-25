# 🍽️ Cielo y Tierra - Sistema de Menú Digital

Sistema completo de menú digital para restaurante con gestión de productos, categorías, pedidos y reservaciones de eventos.

## 🚀 Tecnologías

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Base de Datos**: Neon PostgreSQL (Serverless)
- **Deployment**: Vercel
- **PWA**: Soporte para Progressive Web App

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tu DATABASE_URL de Neon

# Inicializar base de datos
npm run db:init

# (Opcional) Agregar productos de ejemplo
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

## 🗄️ Base de Datos

### Configuración de Neon

1. Crear cuenta en [Neon](https://console.neon.tech/)
2. Crear un nuevo proyecto
3. Copiar la **Connection String**
4. Agregar a `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Scripts de Base de Datos

```bash
# Inicializar todas las tablas
npm run db:init

# Agregar productos de ejemplo
npm run db:seed
```

### Estructura de Tablas

#### `products`
- Productos del menú con precio, descripción, categoría, rating

#### `categories`
- Categorías predefinidas: Desayuno, Almuerzo, Cena, Entrada, Principal, Postre, Bebida

#### `orders`
- Pedidos de clientes con items, total, estado, dirección

#### `celebrations`
- Reservaciones de eventos con fecha, número de invitados, tipo de evento

## 🛠️ Desarrollo

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint
```

## 🌐 Deployment en Vercel

### Paso 1: Conectar Repositorio

1. Ir a [Vercel](https://vercel.com/)
2. Importar tu repositorio de GitHub
3. Seleccionar el proyecto

### Paso 2: Configurar Variables de Entorno

En la configuración del proyecto en Vercel, agregar:

```
DATABASE_URL=tu_connection_string_de_neon
```

### Paso 3: Deploy

```bash
# Deploy automático al hacer push a main
git push origin main

# O manualmente desde Vercel Dashboard
```

## 📱 Características

### Para Clientes
- ✅ Ver menú completo con categorías
- ✅ Buscar productos
- ✅ Agregar al carrito
- ✅ Realizar pedidos
- ✅ Reservar eventos/celebraciones
- ✅ PWA instalable

### Para Administradores
- ✅ Gestionar productos (CRUD)
- ✅ Gestionar categorías
- ✅ Ver y gestionar pedidos
- ✅ Ver y gestionar reservaciones
- ✅ Actualizar estados

## 🔑 Variables de Entorno

```env
# Base de Datos Neon
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

## 📊 API Endpoints

Todos los endpoints son manejados internamente por Next.js:

- `fetchProducts()` - Obtener todos los productos
- `addProduct()` - Agregar nuevo producto
- `updateProduct()` - Actualizar producto
- `deleteProduct()` - Eliminar producto
- `fetchCategories()` - Obtener categorías
- `fetchOrders()` - Obtener pedidos
- `addOrder()` - Crear nuevo pedido
- `updateOrder()` - Actualizar estado de pedido
- `fetchCelebrations()` - Obtener reservaciones
- `addCelebration()` - Crear reservación

## 🎨 Estructura del Proyecto

```
CIeloyTierra/
├── app/                    # Páginas de Next.js
│   ├── admin/             # Panel de administración
│   ├── cart/              # Carrito de compras
│   ├── home/              # Página principal
│   └── menu/              # Menú de productos
├── components/            # Componentes React
├── lib/                   # Lógica de negocio
│   ├── db.ts             # Cliente de Neon
│   ├── productsAPI.ts    # API de productos
│   ├── categoriesAPI.ts  # API de categorías
│   ├── ordersAPI.ts      # API de pedidos
│   └── celebrationsAPI.ts # API de eventos
├── scripts/              # Scripts de BD
│   ├── init-db.js       # Inicializar tablas
│   └── seed-products.js # Datos de ejemplo
├── public/               # Archivos estáticos
└── .env.local           # Variables de entorno
```

## 🐛 Troubleshooting

### Error: "DATABASE_URL is not set"
- Verificar que existe `.env.local`
- Verificar que la variable está correctamente configurada
- Reiniciar el servidor de desarrollo

### Error de conexión a Neon
- Verificar que la connection string es correcta
- Verificar que incluye `?sslmode=require`
- Verificar que el proyecto de Neon está activo

### Tablas no existen
```bash
npm run db:init
```

## 📝 Licencia

Proyecto privado para uso interno del restaurante Cielo y Tierra.

## 👥 Soporte

Para soporte o consultas, contactar al equipo de desarrollo.
