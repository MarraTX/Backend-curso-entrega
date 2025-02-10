const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class CartService {
  constructor() {
    this.path = path.join(__dirname, "../../data/carts.json");
    this.carts = [];
    this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
      this.saveCarts();
    }
  }

  saveCarts() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
  }

  createCart() {
    const newCart = {
      id: uuidv4(),
      products: [],
    };

    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  getCartById(id) {
    return this.carts.find((cart) => cart.id === id);
  }

  addProductToCart(cartId, productId) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex === -1) return null;

    const cart = this.carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(
      (p) => p.product === productId
    );

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, incrementar cantidad
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Si el producto no existe, agregarlo con cantidad 1
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    this.carts[cartIndex] = cart;
    this.saveCarts();
    return cart;
  }
}

module.exports = CartService;
