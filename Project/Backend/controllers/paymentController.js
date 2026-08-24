const Payment = require("../models/Payment");
const Order = require("../models/Order");


// CREATE TEST PAYMENT
const createPayment = async (req, res) => {
    try {
        const { orderId, method } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required"
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            buyer: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.paymentStatus === "PAID") {
            return res.status(400).json({
                message: "Order is already paid"
            });
        }

        const existingPayment = await Payment.findOne({
            order: orderId
        });

        if (existingPayment) {
            return res.status(400).json({
                message: "Payment already initiated"
            });
        }

        const paymentId =
            "TEST_" +
            Date.now() +
            "_" +
            Math.floor(Math.random() * 10000);

        const payment = await Payment.create({
            order: order._id,
            buyer: req.user.id,
            amount: order.totalAmount,
            paymentId: paymentId,
            method: method || "TEST",
            status: "PENDING"
        });

        res.status(201).json({
            message: "Payment initiated",
            payment
        });

    } catch (error) {
        console.error("Create payment error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// VERIFY TEST PAYMENT
const verifyPayment = async (req, res) => {
    try {
        const { paymentId, success } = req.body;

        if (!paymentId) {
            return res.status(400).json({
                message: "Payment ID is required"
            });
        }

        const payment = await Payment.findOne({
            paymentId: paymentId,
            buyer: req.user.id
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        const order = await Order.findById(payment.order);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (success === true) {

            payment.status = "SUCCESS";

            order.paymentStatus = "PAID";
            order.orderStatus = "CONFIRMED";

        } else {

            payment.status = "FAILED";

            order.paymentStatus = "FAILED";
        }

        await payment.save();
        await order.save();

        res.status(200).json({
            message: success === true
                ? "Payment successful"
                : "Payment failed",

            payment,
            order
        });

    } catch (error) {
        console.error("Verify payment error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET MY PAYMENTS
const getMyPayments = async (req, res) => {
    try {

        const payments = await Payment.find({
            buyer: req.user.id
        })
        .populate(
            "order",
            "totalAmount orderStatus paymentStatus"
        )
        .sort({
            createdAt: -1
        });

        res.status(200).json(payments);

    } catch (error) {

        console.error("Get payments error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createPayment,
    verifyPayment,
    getMyPayments
};