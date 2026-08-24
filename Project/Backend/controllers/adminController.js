const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");


// APPROVE PRODUCT
const approveProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.status === "APPROVED") {
            return res.status(400).json({
                message: "Product is already approved"
            });
        }

        product.status = "APPROVED";

        await product.save();

        res.status(200).json({
            message: "Product approved successfully",
            product
        });

    } catch (error) {

        console.error("Approve product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// REJECT PRODUCT
const rejectProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        product.status = "REJECTED";

        await product.save();

        res.status(200).json({
            message: "Product rejected successfully",
            product
        });

    } catch (error) {

        console.error("Reject product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatuses = [
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(
            req.params.orderId
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.orderStatus = status;

        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {

        console.error(
            "Update order status error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET PENDING SELLERS (GET /api/admin/sellers/pending)
const getPendingSellers = async (req, res) => {
    try {
        const User = require("../models/User");
        const pendingSellers = await User.find({ sellerStatus: "PENDING" }).select("-password").sort({ createdAt: -1 });
        res.status(200).json(pendingSellers);
    } catch (error) {
        console.error("Get pending sellers error:", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// APPROVE SELLER (PUT /api/admin/sellers/:id/approve)
const approveSeller = async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.role = "seller";
        user.sellerStatus = "APPROVED";
        await user.save();

        res.status(200).json({
            message: "Seller approved successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerStatus: user.sellerStatus
            }
        });
    } catch (error) {
        console.error("Approve seller error:", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// REJECT SELLER (PUT /api/admin/sellers/:id/reject)
const rejectSeller = async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.role = "buyer";
        user.sellerStatus = "REJECTED";
        await user.save();

        res.status(200).json({
            message: "Seller application rejected",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerStatus: user.sellerStatus
            }
        });
    } catch (error) {
        console.error("Reject seller error:", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    approveProduct,
    rejectProduct,
    updateOrderStatus,
    getPendingSellers,
    approveSeller,
    rejectSeller
};