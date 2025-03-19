const Cart = require("../models/Cart");

class CartService {
  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  async getCartById(id) {
    try {
      console.log("Finding cart with id:", id);
      const cart = await Cart.findById(id).populate("products.product");
      console.log("Cart found:", JSON.stringify(cart, null, 2));
      return cart;
    } catch (error) {
      console.error("Error in getCartById:", error);
      throw new Error("Error al obtener el carrito");
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1,
        });
      }

      await cart.save();
      return await cart.populate("products.product");
    } catch (error) {
      throw new Error("Error al agregar producto al carrito");
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );

      await cart.save();
      return await cart.populate("products.product");
    } catch (error) {
      throw new Error("Error al eliminar producto del carrito");
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = products;
      await cart.save();
      return await cart.populate("products.product");
    } catch (error) {
      throw new Error("Error al actualizar el carrito");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex === -1) return null;

      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return await cart.populate("products.product");
    } catch (error) {
      throw new Error("Error al actualizar la cantidad del producto");
    }
  }

  async clearCart(cartId) {
    try {
      const result = await Cart.findByIdAndDelete(cartId);
      if (!result) {
        throw new Error("Carrito no encontrado");
      }
      return true;
    } catch (error) {
      throw new Error("Error al eliminar el carrito");
    }
  }
}

module.exports = CartService;
