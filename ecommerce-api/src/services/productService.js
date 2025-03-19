const Product = require("../models/Product");

class ProductService {
  async getAllProducts(options = {}) {
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

    try {
      const result = await Product.paginate(queryObject, {
        limit,
        page,
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
        lean: true,
      });

      // Construir URLs con todos los parámetros
      const baseUrl = "/api/products";
      const queryString = new URLSearchParams({
        limit: limit.toString(),
        ...(sort && { sort }),
        ...(query.category && { category: query.category }),
        ...(query.status !== undefined && { status: query.status }),
      }).toString();

      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `${baseUrl}?${queryString}&page=${result.prevPage}`
          : null,
        nextLink: result.hasNextPage
          ? `${baseUrl}?${queryString}&page=${result.nextPage}`
          : null,
      };
    } catch (error) {
      return {
        status: "error",
        payload: [],
        message: error.message,
      };
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id).lean();
    } catch (error) {
      throw new Error("Error al obtener el producto");
    }
  }

  async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Error al crear el producto: " + error.message);
    }
  }

  async updateProduct(id, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      }).lean();
      return updatedProduct;
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }
}

module.exports = ProductService;
