const CartService = require("../services/cartService");
const cartService = new CartService();
const ProductService = require("../services/productService");

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json({
        status: "success",
        payload: {
          _id: newCart._id.toString(),
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      console.log("Controller: Intentando agregar producto:", {
        cartId: cid,
        productId: pid,
      });

      // Validar que el carrito existe
      const cart = await cartService.getCartById(cid);
      console.log("Controller: Cart found:", cart ? "Sí" : "No");

      // Validar que el producto existe
      const product = await ProductService.getProductById(pid);
      console.log("Controller: Product found:", product ? "Sí" : "No");

      if (!product) {
        return res.status(404).json({
          status: "error",
          error: "Producto no encontrado",
        });
      }

      const updatedCart = await cartService.addProductToCart(cid, pid);
      console.log("Controller: Cart updated successfully");

      return res.status(200).json({
        status: "success",
        payload: updatedCart,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      return res.status(404).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartService.removeProductFromCart(cid, pid);
      if (!updatedCart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      const updatedCart = await cartService.updateCart(cid, products);
      if (!updatedCart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const updatedCart = await cartService.updateProductQuantity(
        cid,
        pid,
        quantity
      );
      if (!updatedCart) {
        return res
          .status(404)
          .json({ error: "Carrito o producto no encontrado" });
      }
      res.json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      const { cid } = req.params;
      const result = await cartService.clearCart(cid);
      if (!result) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.status(200).json({ message: "Carrito eliminado con éxito" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CartController();
