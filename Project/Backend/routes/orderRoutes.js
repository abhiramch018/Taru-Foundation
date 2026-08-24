const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById
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

module.exports = router;