const express = require("express");
const router = express.Router();
const ProductService = require("../services/productService");
const CartService = require("../services/cartService");
const productService = new ProductService();
const cartService = new CartService();

// Vista principal con todos los productos y paginación
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      query: category ? { category } : {},
    };

    const result = await productService.getAllProducts(options);
    res.render("products", {
      products: result.payload,
      pagination: {
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      },
    });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

// Vista de detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product) {
      return res
        .status(404)
        .render("error", { error: "Producto no encontrado" });
    }
    res.render("productDetail", { product });
  } catch (error) {
    console.error("Error in product detail route:", error);
    res.status(500).render("error", { error: error.message });
  }
});

// Vista de carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cid);
    console.log("Cart from service:", JSON.stringify(cart, null, 2));

    if (!cart) {
      return res
        .status(404)
        .render("error", { error: "Carrito no encontrado" });
    }

    // Verifica que los productos estén poblados correctamente
    console.log("Products in cart:", JSON.stringify(cart.products, null, 2));

    // Pasa los datos explícitamente
    res.render("cart", {
      cart: {
        _id: cart._id,
        products: cart.products.map((p) => ({
          product: p.product,
          quantity: p.quantity,
          _id: p._id,
        })),
      },
    });
  } catch (error) {
    console.error("Error in cart route:", error);
    res.status(500).render("error", { error: error.message });
  }
});

module.exports = router;
