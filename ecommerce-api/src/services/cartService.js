const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

class CartService {
  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  async getCartById(id) {
    try {
      console.log("Finding cart with id:", id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de carrito no válido");
      }

      const cart = await Cart.findById(id).populate("products.product");
      console.log("Cart found:", cart ? "Sí" : "No");

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      return cart;
    } catch (error) {
      console.error("Error in getCartById:", error);
      throw new Error(error.message);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      console.log("Adding product to cart:", { cartId, productId });

      // Verificar que el carrito existe
      const cart = await Cart.findById(cartId);
      console.log("Cart found:", cart ? "Sí" : "No");

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Buscar si el producto ya está en el carrito
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad
        cart.products[productIndex].quantity += 1;
      } else {
        // Si el producto no existe, agregarlo
        cart.products.push({
          product: productId,
          quantity: 1,
        });
      }

      // Guardar los cambios
      const savedCart = await cart.save();
      console.log("Cart saved successfully");

      // Retornar el carrito actualizado con los productos poblados
      const populatedCart = await savedCart.populate("products.product");
      return populatedCart;
    } catch (error) {
      console.error("Error in addProductToCart:", error);
      throw new Error(error.message);
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
