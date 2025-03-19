const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const ProductService = require("../services/productService");

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    const options = {
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 1,
      sort,
      query: {},
    };

    if (category) options.query.category = category;
    if (status !== undefined) options.query.status = status === "true";

    const result = await ProductService.getAllProducts(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:pid", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

module.exports = router;
