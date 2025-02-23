# E-commerce API 🛍️

API RESTful para la gestión de productos y carritos de compra, desarrollada con Node.js, Express, Handlebars y WebSocket.

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/ecommerce-api.git
cd ecommerce-api
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor:

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:8080`

## 🔗 Endpoints y Vistas

### 🌐 Vistas con Handlebars

| Ruta                | Descripción                        |
| ------------------- | ---------------------------------- |
| `/`                 | Vista estática de productos        |
| `/realtimeproducts` | Vista en tiempo real con WebSocket |

### 📦 Productos API

| Método | Endpoint             | Descripción                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/api/products`      | Obtener todos los productos |
| GET    | `/api/products/:pid` | Obtener producto por ID     |
| POST   | `/api/products`      | Crear nuevo producto        |
| PUT    | `/api/products/:pid` | Actualizar producto por ID  |
| DELETE | `/api/products/:pid` | Eliminar producto           |

#### Ejemplo de body para crear un producto:

```json
{
  "title": "Nombre del producto",
  "description": "Descripción del producto",
  "code": "ABC123",
  "price": 999.99,
  "stock": 100,
  "category": "Categoría",
  "thumbnails": ["url1.jpg", "url2.jpg"]
}
```

### 🛒 Carritos API

| Método | Endpoint                       | Descripción                 |
| ------ | ------------------------------ | --------------------------- |
| POST   | `/api/carts`                   | Crear nuevo carrito         |
| GET    | `/api/carts/:cid`              | Obtener carrito por ID      |
| POST   | `/api/carts/:cid/product/:pid` | Agregar producto al carrito |

## 📁 Estructura de Archivos

```
ecommerce-api/
├── data/
│   ├── products.json
│   └── carts.json
├── public/
│   └── js/
├── src/
│   ├── controllers/
│   │   ├── productController.js
│   │   └── cartController.js
│   ├── models/
│   ├── routes/
│   │   ├── products.js
│   │   ├── carts.js
│   │   └── views.js
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── home.handlebars
│   │   └── realTimeProducts.handlebars
│   └── services/
│       ├── productService.js
│       └── cartService.js
├── index.js
└── package.json
```

## 🛠️ Tecnologías Utilizadas

- **Express.js** - Framework web
- **Express Handlebars** - Motor de plantillas
- **Socket.io** - Comunicación en tiempo real
- **UUID** - Generación de IDs únicos
- **Nodemon** - Desarrollo con recarga automática

## 🔌 WebSocket

El proyecto implementa WebSocket para actualizaciones en tiempo real en la vista `/realtimeproducts`. Los eventos disponibles son:

- `connection` - Cliente conectado
- `products` - Actualización de lista de productos
- `newProduct` - Crear nuevo producto
- `deleteProduct` - Eliminar producto
- `error` - Manejo de errores

### Ejemplo de uso con WebSocket:

```javascript
// Cliente
const socket = io();

// Escuchar actualizaciones de productos
socket.on("products", (products) => {
  // Actualizar UI
});

// Enviar nuevo producto
socket.emit("newProduct", productData);

// Eliminar producto
socket.emit("deleteProduct", productId);
```

## 📝 Handlebars Views

### Home View (`/`)

Vista estática que muestra la lista de productos actual.

### RealTime Products View (`/realtimeproducts`)

Vista dinámica que incluye:

- Lista de productos en tiempo real
- Formulario para agregar productos
- Botones para eliminar productos
- Actualizaciones automáticas vía WebSocket

## 💾 Persistencia

Los datos se almacenan en archivos JSON:

- `data/products.json` - Almacena los productos
- `data/carts.json` - Almacena los carritos

## 📜 Scripts Disponibles

| Comando       | Descripción                                    |
| ------------- | ---------------------------------------------- |
| `npm start`   | Inicia el servidor en modo producción          |
| `npm run dev` | Inicia el servidor con nodemon para desarrollo |

## 📌 Notas

- Las vistas se renderizan usando Handlebars
- La vista `/realtimeproducts` se actualiza automáticamente mediante WebSocket
- Todos los campos son obligatorios para crear un producto, excepto `thumbnails`
- Los IDs se generan automáticamente usando UUID
- El status de los productos es `true` por defecto
