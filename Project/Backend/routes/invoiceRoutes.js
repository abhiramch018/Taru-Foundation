const express = require("express");

const {
    generateInvoice
} = require("../controllers/invoiceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/:orderId",
    authMiddleware,
    roleMiddleware("buyer"),
    generateInvoice
);

module.exports = router;