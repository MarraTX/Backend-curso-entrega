const CartService = require("../services/cartService");
const cartService = new CartService();

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      const updatedCart = await cartService.addProductToCart(cid, pid);
      if (!updatedCart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
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
