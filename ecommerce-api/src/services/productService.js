const mongoose = require("mongoose");
const Product = require("../models/Product");

class ProductService {
  static async getAllProducts(options = {}) {
    try {
      const { limit = 10, page = 1, sort, query = {} } = options;

      // Agregar validación de sort
      if (sort && !["asc", "desc"].includes(sort)) {
        throw new Error('Sort debe ser "asc" o "desc"');
      }

      // Mejorar el manejo de query
      const queryObject = {};
      if (query.category) queryObject.category = query.category;
      if (query.status !== undefined)
        queryObject.status = query.status === "true";

      // Configurar las opciones de paginación para Mongoose
      const paginateOptions = {
        page: page,
        limit: limit,
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
        lean: true, // Esto asegura que obtenemos objetos planos de JavaScript
      };

      // Realizar la consulta paginada
      const result = await Product.paginate(queryObject, paginateOptions);

      // Asegurarse de que cada documento tenga su _id
      const docs = result.docs.map((doc) => ({
        ...doc,
        _id: doc._id.toString(), // Convertir el ObjectId a string
      }));

      // Formatear la respuesta
      return {
        status: "success",
        payload: docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `/products?page=${result.prevPage}&limit=${limit}`
          : null,
        nextLink: result.hasNextPage
          ? `/products?page=${result.nextPage}&limit=${limit}`
          : null,
      };
    } catch (error) {
      throw new Error("Error al obtener los productos: " + error.message);
    }
  }

  static async getProductById(id) {
    try {
      // Verificar si el ID es válido para MongoDB
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de producto no válido");
      }

      const product = await Product.findById(id).lean();
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      // Propagar el error específico
      throw new Error(error.message);
    }
  }

  static async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Error al crear el producto: " + error.message);
    }
  }

  static async updateProduct(id, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      }).lean();
      return updatedProduct;
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  static async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }

  static async getUniqueCategories() {
    try {
      const categories = await Product.distinct("category");
      return categories;
    } catch (error) {
      throw new Error("Error al obtener las categorías: " + error.message);
    }
  }
}

module.exports = ProductService;
