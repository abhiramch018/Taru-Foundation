const express = require("express");
const {
    registerUser,
    verifyOtp,
    resendOtp,
    loginUser,
    applySeller,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/apply-seller", authMiddleware, applySeller);

// Always query live DB so that role/sellerStatus updates (e.g. seller approval)
// are immediately reflected without requiring the user to re-login.
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerStatus: user.sellerStatus || "NONE",
                shgName: user.shgName || "",
                phone: user.phone || "",
                address: user.address || "",
                district: user.district || "",
                state: user.state || "",
                membersCount: user.membersCount || "",
                description: user.description || "",
                craftCategories: user.craftCategories || []
            }
        });
    } catch (error) {
        console.error("Get me error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
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