const express = require("express");
const router = express.Router();
const ProductService = require("../services/productService");
const CartService = require("../services/cartService");
const mongoose = require("mongoose");
const cartService = new CartService();

// Vista principal con todos los productos y paginación
router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;

    const options = {
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 1,
      sort,
      query: {},
    };

    if (category) {
      options.query.category = category;
    }
    if (status !== undefined) {
      options.query.status = status === "true";
    }

    // Obtener las categorías
    const categories = await ProductService.getUniqueCategories();
    const result = await ProductService.getAllProducts(options);

    res.render("products", {
      products: result.payload,
      categories: categories,
      selectedCategory: { [category]: true }, // Cambiado a un objeto para usar lookup
      pagination: {
        totalPages: result.totalPages,
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
    console.error("Error completo:", error);
    res.status(500).render("error", { error: error.message });
  }
});

// Vista de detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    // Validar el formato del ID antes de hacer la consulta
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return res.status(400).render("error", {
        error: "El ID del producto no es válido",
      });
    }

    const product = await ProductService.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).render("error", {
        error: "Producto no encontrado",
      });
    }

    // Asegurarse de que el ID esté disponible en la vista
    res.render("productDetail", {
      product: {
        ...product,
        _id: product._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error in product detail route:", error);
    res.status(500).render("error", {
      error: error.message || "Error al obtener el producto",
    });
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
