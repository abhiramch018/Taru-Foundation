const express = require("express");
const { registerUser, loginUser, applySeller } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/apply-seller", authMiddleware, applySeller);

router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "You are authenticated",
        user: req.user
    });
});

// Temporary role testing routes
router.get(
    "/buyer-test",
    authMiddleware,
    roleMiddleware("buyer"),
    (req, res) => {
        res.json({
            message: "Buyer access granted"
        });
    }
);

router.get(
    "/seller-test",
    authMiddleware,
    roleMiddleware("seller"),
    (req, res) => {
        res.json({
            message: "Seller access granted"
        });
    }
);

module.exports = router;