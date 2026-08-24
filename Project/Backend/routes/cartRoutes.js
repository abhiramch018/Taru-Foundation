const express = require("express");

const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// Get buyer's cart
router.get(
    "/",
    authMiddleware,
    roleMiddleware("buyer"),
    getCart
);


// Add product to cart
router.post(
    "/",
    authMiddleware,
    roleMiddleware("buyer"),
    addToCart
);


// Update quantity
router.put(
    "/:productId",
    authMiddleware,
    roleMiddleware("buyer"),
    updateCartItem
);


// Remove product
router.delete(
    "/:productId",
    authMiddleware,
    roleMiddleware("buyer"),
    removeFromCart
);


module.exports = router;