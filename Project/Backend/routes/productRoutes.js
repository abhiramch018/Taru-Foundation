const express = require("express");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// GET all approved products
router.get("/", getProducts);


// GET product by ID
router.get("/:id", getProductById);


// CREATE product - Seller only
router.post(
    "/",
    authMiddleware,
    roleMiddleware("seller"),
    createProduct
);


// UPDATE product - Seller only
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("seller"),
    updateProduct
);


// DELETE product - Seller only
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("seller"),
    deleteProduct
);


module.exports = router;