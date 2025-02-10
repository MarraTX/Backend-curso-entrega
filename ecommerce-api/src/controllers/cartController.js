const CartService = require("../services/cartService");
const cartService = new CartService();

class CartController {
  async createCart(req, res) {
    try {
      const newCart = cartService.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = cartService.getCartById(cid);
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
      const updatedCart = cartService.addProductToCart(cid, pid);
      if (!updatedCart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new CartController();
