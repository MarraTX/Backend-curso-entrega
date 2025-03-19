const ProductService = require("../services/productService");
const productService = new ProductService();

class ProductController {
  async getProducts(req, res) {
    try {
      const { limit, page, sort, category, status } = req.query;

      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
        sort,
        query: {},
      };

      // Agregar filtros si existen
      if (category) {
        options.query.category = category;
      }
      if (status !== undefined) {
        options.query.status = status === "true";
      }

      const result = await productService.getAllProducts(options);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { pid } = req.params;
      const product = productService.getProductById(pid);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      const newProduct = productService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { pid } = req.params;
      const updateData = req.body;
      const updatedProduct = productService.updateProduct(pid, updateData);
      if (!updatedProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      const result = productService.deleteProduct(pid);
      if (!result) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
