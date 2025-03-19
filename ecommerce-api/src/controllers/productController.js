const ProductService = require("../services/productService");
const mongoose = require("mongoose");

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

      // Usar el método estático
      const result = await ProductService.getAllProducts(options);

      // Renderizar la vista en lugar de enviar JSON
      return res.render("products", {
        products: result.payload,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        currentPage: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      });
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

      // Verificar si el ID es válido para MongoDB
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).render("error", {
          error: "ID de producto no válido",
        });
      }

      const product = await ProductService.getProductById(pid);

      if (!product) {
        return res.status(404).render("error", {
          error: "Producto no encontrado",
        });
      }

      // Renderizar la vista de detalle del producto
      return res.render("productDetail", {
        product: {
          ...product,
          _id: product._id.toString(),
        },
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).render("error", {
        error: error.message,
      });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;

      // Si es un array de productos
      if (Array.isArray(productData)) {
        // Validar que cada producto tenga los campos requeridos
        const invalidProducts = productData.filter((product) => {
          return (
            !product.title ||
            !product.description ||
            !product.code ||
            !product.price ||
            !product.stock ||
            !product.category
          );
        });

        if (invalidProducts.length > 0) {
          return res.status(400).json({
            status: "error",
            error:
              "Todos los productos deben tener los campos requeridos: title, description, code, price, stock, category",
          });
        }

        // Crear múltiples productos
        const createdProducts = [];
        for (const product of productData) {
          const newProduct = await ProductService.createProduct(product);
          createdProducts.push(newProduct);
        }

        return res.status(201).json({
          status: "success",
          payload: createdProducts,
        });
      }

      // Para un solo producto
      if (
        !productData.title ||
        !productData.description ||
        !productData.code ||
        !productData.price ||
        !productData.stock ||
        !productData.category
      ) {
        return res.status(400).json({
          status: "error",
          error:
            "Todos los campos son requeridos: title, description, code, price, stock, category",
        });
      }

      const newProduct = await ProductService.createProduct(productData);
      res.status(201).json({
        status: "success",
        payload: newProduct,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { pid } = req.params;
      const updateData = req.body;
      const updatedProduct = ProductService.updateProduct(pid, updateData);
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
      const result = ProductService.deleteProduct(pid);
      if (!result) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Exportar una nueva instancia del controlador
module.exports = new ProductController();
