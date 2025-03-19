# E-commerce API

Una aplicación de comercio electrónico construida con Node.js, Express, MongoDB y Handlebars.

## Características

- Catálogo de productos con paginación
- Sistema de carrito de compras
- Vista detallada de productos
- Manejo de sesiones de carrito persistentes
- Interfaz de usuario intuitiva
- Actualización en tiempo real con Socket.io

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd ecommerce-api
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar MongoDB:

- Asegúrate de tener MongoDB corriendo localmente en el puerto 27017
- La base de datos se creará automáticamente con el nombre 'ecommerce'

4. Iniciar el servidor:

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:8080`

## Estructura del Proyecto

## 🔗 Endpoints y Vistas

### 🌐 Vistas con Handlebars

| Ruta                | Descripción                        |
| ------------------- | ---------------------------------- |
| `/products`         | Vista de productos con paginación  |
| `/products/:pid`    | Vista detallada de un producto     |
| `/carts/:cid`       | Vista del carrito específico       |
| `/realtimeproducts` | Vista en tiempo real con WebSocket |

### 📦 Productos API

| Método | Endpoint             | Descripción             | Query Params             |
| ------ | -------------------- | ----------------------- | ------------------------ |
| GET    | `/api/products`      | Obtener productos       | limit, page, sort, query |
| GET    | `/api/products/:pid` | Obtener producto por ID | -                        |
| POST   | `/api/products`      | Crear nuevo producto    | -                        |
| PUT    | `/api/products/:pid` | Actualizar producto     | -                        |
| DELETE | `/api/products/:pid` | Eliminar producto       | -                        |

#### Query Params para GET /api/products

- `limit`: Número de elementos por página (default: 10)
- `page`: Número de página (default: 1)
- `sort`: Ordenamiento por precio ('asc' o 'desc')
- `query`: Filtrar por categoría o disponibilidad

#### Ejemplo de respuesta paginada:

```json
{
    "status": "success",
    "payload": [...productos],
    "totalPages": 5,
    "prevPage": 1,
    "nextPage": 3,
    "page": 2,
    "hasPrevPage": true,
    "hasNextPage": true,
    "prevLink": "/api/products?page=1",
    "nextLink": "/api/products?page=3"
}
```

### 🛒 Carritos API

| Método | Endpoint                        | Descripción                        |
| ------ | ------------------------------- | ---------------------------------- |
| POST   | `/api/carts`                    | Crear nuevo carrito                |
| GET    | `/api/carts/:cid`               | Obtener carrito por ID             |
| POST   | `/api/carts/:cid/products/:pid` | Agregar producto al carrito        |
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar producto del carrito      |
| PUT    | `/api/carts/:cid`               | Actualizar carrito completo        |
| PUT    | `/api/carts/:cid/products/:pid` | Actualizar cantidad de un producto |
| DELETE | `/api/carts/:cid`               | Eliminar carrito                   |

### 🛒 Funcionalidades del Carrito

- Visualización de productos en el carrito con detalles completos
- Modificación de cantidades con botones + y -
- Cálculo automático de subtotales y total
- Botón "Seguir Comprando" para volver a productos
- Botón "Finalizar Compra" con confirmación
- Eliminación individual de productos
- Vaciado completo del carrito
- Persistencia del ID del carrito en localStorage

### 📊 Ejemplos de Respuestas

#### Producto

```json
{
  "_id": "...",
  "title": "Smartphone XYZ",
  "description": "Último modelo",
  "code": "PHONE123",
  "price": 999.99,
  "status": true,
  "stock": 50,
  "category": "Smartphones",
  "thumbnails": ["url1.jpg", "url2.jpg"]
}
```

#### Carrito

```json
{
  "_id": "...",
  "products": [
    {
      "product": {
        "_id": "...",
        "title": "Smartphone XYZ",
        "price": 999.99
      },
      "quantity": 2
    }
  ]
}
```

## 🚨 Manejo de Errores

El API devuelve los siguientes códigos de estado:

- 200: Éxito
- 201: Creado exitosamente
- 400: Error en la solicitud
- 404: Recurso no encontrado
- 500: Error interno del servidor

Ejemplo de respuesta de error:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

## 💾 Configuración de MongoDB

1. Asegúrate de tener MongoDB instalado localmente
2. El servidor debe estar corriendo en `mongodb://127.0.0.1:27017`
3. La base de datos se creará automáticamente con el nombre `ecommerce`
4. Las colecciones que se crearán son:
   - `products`
   - `carts`

Para verificar la conexión:

1. Abre MongoDB Compass
2. Conecta a `mongodb://localhost:27017`
3. Deberías ver la base de datos `ecommerce`

## 🧪 Pruebas

Para probar el sistema:

1. Crear productos:

   - Usar Postman o cURL para crear varios productos
   - Verificar en MongoDB Compass

2. Probar el carrito:

   - Agregar productos al carrito
   - Modificar cantidades
   - Eliminar productos
   - Finalizar compra

3. Probar filtros y paginación:
   - Usar diferentes combinaciones de query params
   - Probar ordenamiento ascendente y descendente
   - Verificar la paginación
