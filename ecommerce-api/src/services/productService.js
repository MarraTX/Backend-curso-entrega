const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class ProductService {
  constructor() {
    this.path = path.join(__dirname, "../../data/products.json");
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
      this.saveProducts();
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  getAllProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  createProduct(productData) {
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails = [],
    } = productData;

    // Validar campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Todos los campos son obligatorios excepto thumbnails");
    }

    const newProduct = {
      id: uuidv4(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails,
    };

    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(id, updateData) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return null;

    // Evitar modificar el id
    const { id: _, ...updateFields } = updateData;

    const updatedProduct = {
      ...this.products[index],
      ...updateFields,
    };

    this.products[index] = updatedProduct;
    this.saveProducts();
    return updatedProduct;
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    this.saveProducts();
    return true;
  }
}

module.exports = ProductService;
