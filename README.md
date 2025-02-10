# E-commerce API 🛍️

API RESTful para la gestión de productos y carritos de compra, desarrollada con Node.js y Express.

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

## 🔗 Endpoints

### 📦 Productos

| Método | Endpoint             | Descripción                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/api/products`      | Obtener todos los productos |
| GET    | `/api/products/:pid` | Obtener producto por ID     |
| POST   | `/api/products`      | Crear nuevo producto        |
| PUT    | `/api/products/:pid` | Actualizar producto por ID  |
| DELETE | `/api/products/:pid` | Eliminar producto           |

#### Ejemplo de body para crear producto:

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

### 🛒 Carritos

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
├── src/
│   ├── controllers/
│   │   ├── productController.js
│   │   └── cartController.js
│   ├── models/
│   ├── routes/
│   │   ├── products.js
│   │   └── carts.js
│   └── services/
│       ├── productService.js
│       └── cartService.js
├── index.js
└── package.json
```

## 💾 Persistencia

Los datos se almacenan en archivos JSON:

- `data/products.json` - Almacena los productos
- `data/carts.json` - Almacena los carritos

## 📜 Scripts Disponibles

| Comando       | Descripción                                    |
| ------------- | ---------------------------------------------- |
| `npm start`   | Inicia el servidor en modo producción          |
| `npm run dev` | Inicia el servidor con nodemon para desarrollo |

## 🛠️ Tecnologías Utilizadas

- **Express.js** - Framework web
- **UUID** - Generación de IDs únicos
- **Nodemon** - Desarrollo con recarga automática

## 📝 Ejemplos de Uso

### Crear un Producto

```bash
curl -X POST http://localhost:8080/api/products \
-H "Content-Type: application/json" \
-d '{
    "title": "Smartphone XYZ",
    "description": "Último modelo",
    "code": "PHONE-123",
    "price": 999.99,
    "stock": 100,
    "category": "Electrónica",
    "thumbnails": ["img/phone1.jpg"]
}'
```

### Crear un Carrito

```bash
curl -X POST http://localhost:8080/api/carts
```

## 📌 Notas

- Todos los campos son obligatorios para crear un producto, excepto `thumbnails`
- Los IDs se generan automáticamente usando UUID
- El status de los productos es `true` por defecto
