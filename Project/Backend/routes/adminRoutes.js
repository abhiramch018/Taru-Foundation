const express = require("express");

const {
    approveProduct,
    rejectProduct,
    updateOrderStatus,
    getPendingSellers,
    approveSeller,
    rejectSeller
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// APPROVE PRODUCT
router.put(
    "/products/:id/approve",
    authMiddleware,
    roleMiddleware("admin"),
    approveProduct
);


// REJECT PRODUCT
router.put(
    "/products/:id/reject",
    authMiddleware,
    roleMiddleware("admin"),
    rejectProduct
);


// UPDATE ORDER STATUS
router.put(
    "/orders/:orderId/status",
    authMiddleware,
    roleMiddleware("admin"),
    updateOrderStatus
);


// GET PENDING SELLERS
router.get(
    "/sellers/pending",
    authMiddleware,
    roleMiddleware("admin"),
    getPendingSellers
);


// APPROVE SELLER
router.put(
    "/sellers/:id/approve",
    authMiddleware,
    roleMiddleware("admin"),
    approveSeller
);


// REJECT SELLER
router.put(
    "/sellers/:id/reject",
    authMiddleware,
    roleMiddleware("admin"),
    rejectSeller
);


module.exports = router;