const express = require("express");
const productsRouter = require("./src/routes/products");
const cartsRouter = require("./src/routes/carts");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});
