const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const productService = require("../services/productService");

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;

    // Validar parámetros
    if (sort && !["asc", "desc"].includes(sort)) {
      return res.status(400).json({
        status: "error",
        message: 'Sort debe ser "asc" o "desc"',
      });
    }

    const result = await productService.getAllProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query: { category, status },
    });

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
