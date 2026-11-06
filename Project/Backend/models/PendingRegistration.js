const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
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

        requestedRole: {
            type: String,
            enum: ["buyer", "seller"],
            default: "buyer"
        },

        otpHash: {
            type: String,
            required: true
        },

        otpExpires: {
            type: Date,
            required: true
        },

        otpAttempts: {
            type: Number,
            default: 0
        },

        lastOtpSentAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

pendingRegistrationSchema.index(
    { otpExpires: 1 },
    { expireAfterSeconds: 0 }
);

const PendingRegistration = mongoose.model(
    "PendingRegistration",
    pendingRegistrationSchema
);

module.exports = PendingRegistration;
