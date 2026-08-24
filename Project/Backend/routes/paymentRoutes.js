const express = require("express");

const {
    createPayment,
    verifyPayment,
    getMyPayments
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// Create payment
router.post(
    "/",
    authMiddleware,
    roleMiddleware("buyer"),
    createPayment
);


// Verify payment
router.post(
    "/verify",
    authMiddleware,
    roleMiddleware("buyer"),
    verifyPayment
);


// Get my payments
router.get(
    "/",
    authMiddleware,
    roleMiddleware("buyer"),
    getMyPayments
);


module.exports = router;