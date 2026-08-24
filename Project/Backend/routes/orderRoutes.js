const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("buyer"),
    createOrder
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("buyer"),
    getMyOrders
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("buyer"),
    getOrderById
);

// Buyer can cancel their own order only when status is PLACED or CONFIRMED
router.put(
    "/:id/cancel",
    authMiddleware,
    roleMiddleware("buyer"),
    cancelOrder
);

module.exports = router;