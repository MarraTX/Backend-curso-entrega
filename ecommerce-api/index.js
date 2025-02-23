const express = require("express");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const productsRouter = require("./src/routes/products");
const cartsRouter = require("./src/routes/carts");
const viewsRouter = require("./src/routes/views");
const ProductService = require("./src/services/productService");

const app = express();
const PORT = 8080;

// Handlebars configuration
app.engine("handlebars", engine());
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
