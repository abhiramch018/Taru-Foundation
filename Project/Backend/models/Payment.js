const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true
        },

        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentId: {
            type: String,
            required: true,
            unique: true
        },

        method: {
            type: String,
            enum: ["CARD", "UPI", "NET_BANKING", "TEST"],
            default: "TEST"
        },

        status: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;