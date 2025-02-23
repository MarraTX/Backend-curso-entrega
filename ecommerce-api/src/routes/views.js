const express = require("express");
const router = express.Router();
const ProductService = require("../services/productService");
const productService = new ProductService();

router.get("/", (req, res) => {
  const products = productService.getAllProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
  const products = productService.getAllProducts();
  res.render("realTimeProducts", { products });
});

module.exports = router;
