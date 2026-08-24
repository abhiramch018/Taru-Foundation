const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        images: {
            type: [String],
            default: []
        },

        stock: {
            type: Number,
            required: true,
            min: 0
        },

        type: {
            type: String,
            enum: ["STANDARD", "UNIQUE"],
            default: "STANDARD"
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;