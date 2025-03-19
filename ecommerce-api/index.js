const express = require("express");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const productsRouter = require("./src/routes/products");
const cartsRouter = require("./src/routes/carts");
const viewsRouter = require("./src/routes/views");
const ProductService = require("./src/services/productService");
const hbs = require("handlebars");

const app = express();
const PORT = 8080;

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Handlebars configuration
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});

// Socket.io configuration
const io = new Server(httpServer);
const productService = new ProductService();

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Enviar lista de productos al cliente cuando se conecta
  socket.emit("products", productService.getAllProducts());

  // Escuchar nuevo producto
  socket.on("newProduct", (productData) => {
    try {
      const newProduct = productService.createProduct(productData);
      io.emit("products", productService.getAllProducts());
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  // Escuchar eliminación de producto
  socket.on("deleteProduct", (productId) => {
    try {
      productService.deleteProduct(productId);
      io.emit("products", productService.getAllProducts());
    } catch (error) {
      socket.emit("error", error.message);
    }
  });
});

// Agregar helpers para Handlebars
hbs.registerHelper("multiply", function (a, b) {
  return a * b;
});

hbs.registerHelper("add", function (a, b) {
  return a + b;
});

hbs.registerHelper("subtract", function (a, b) {
  return a - b;
});

hbs.registerHelper("calculateTotal", function (products) {
  return products.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
});

hbs.registerHelper("json", function (context) {
  return JSON.stringify(context, null, 2);
});

hbs.registerHelper("log", function (something) {
  console.log(something);
  return "";
});
