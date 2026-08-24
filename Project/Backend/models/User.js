const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["buyer", "seller", "admin"],
            default: "buyer"
        },

        sellerStatus: {
            type: String,
            enum: ["NONE", "PENDING", "APPROVED", "REJECTED"],
            default: "NONE"
        },

        shgName: {
            type: String,
            trim: true
        },

        shgRegNumber: {
            type: String,
            trim: true
        },

        district: {
            type: String,
            trim: true
        },

        state: {
            type: String,
            trim: true
        },

        membersCount: {
            type: String,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        craftCategories: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;