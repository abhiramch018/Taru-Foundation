const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/mailer");

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

const hashOtp = (otp) =>
    crypto.createHash("sha256").update(otp).digest("hex");


// REGISTER — sends OTP; user is created only after verify-otp
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;

        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Public users can never directly create an admin account.
        const requestedRole = role === "seller" ? "seller" : "buyer";

        const otp = generateOtp();
        const otpHash = hashOtp(otp);
        const hashedPassword = await bcrypt.hash(password, 10);

        await PendingRegistration.findOneAndUpdate(
            { email: normalizedEmail },
            {
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                phone,
                address,
                requestedRole,
                otpHash,
                otpExpires: Date.now() + OTP_EXPIRY_MS,
                otpAttempts: 0,
                lastOtpSentAt: Date.now()
            },
            { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
        );

        await sendEmail({
            to: normalizedEmail,
            subject: "Taru Foundation - Email Verification OTP",
            text: `
Your Taru Foundation verification code is: ${otp}

This code will expire in 10 minutes.

If you did not request this, you can safely ignore this email.
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2>Taru Foundation</h2>
                    <p>Your email verification code is:</p>
                    <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #166534;">
                        ${otp}
                    </p>
                    <p>This code will expire in <strong>10 minutes</strong>.</p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                </div>
            `
        });

        res.status(200).json({
            message: "Verification OTP sent to your email.",
            requiresOtp: true,
            email: normalizedEmail
        });

    } catch (error) {
        console.error("Error registering user:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// VERIFY OTP — creates user after successful verification
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const pending = await PendingRegistration.findOne({
            email: normalizedEmail
        });

        if (!pending) {
            return res.status(400).json({
                message: "No pending registration found. Please register again."
            });
        }

        if (pending.otpExpires < Date.now()) {
            await PendingRegistration.deleteOne({ _id: pending._id });
            return res.status(400).json({
                message: "OTP has expired. Please register again."
            });
        }

        if (pending.otpAttempts >= MAX_OTP_ATTEMPTS) {
            return res.status(400).json({
                message: "Too many incorrect attempts. Please register again."
            });
        }

        const submittedHash = hashOtp(otp.trim());

        if (submittedHash !== pending.otpHash) {
            pending.otpAttempts += 1;
            await pending.save();

            const attemptsLeft = MAX_OTP_ATTEMPTS - pending.otpAttempts;

            if (attemptsLeft <= 0) {
                return res.status(400).json({
                    message: "Too many incorrect attempts. Please register again."
                });
            }

            return res.status(400).json({
                message: `Invalid OTP. ${attemptsLeft} attempt(s) remaining.`
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            await PendingRegistration.deleteOne({ _id: pending._id });
            return res.status(400).json({
                message: "User already exists. Please sign in."
            });
        }

        const isSellerApplication = pending.requestedRole === "seller";

        const user = await User.create({
            name: pending.name,
            email: pending.email,
            password: pending.password,
            phone: pending.phone,
            address: pending.address,
            role: "buyer",
            sellerStatus: isSellerApplication ? "PENDING" : "NONE"
        });

        await PendingRegistration.deleteOne({ _id: pending._id });

        res.status(201).json({
            message: isSellerApplication
                ? "Email verified! Seller application submitted and pending admin approval."
                : "Email verified! Account created successfully.",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerStatus: user.sellerStatus
            }
        });

    } catch (error) {
        console.error("Verify OTP error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// RESEND OTP — new OTP with 60-second cooldown
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const pending = await PendingRegistration.findOne({
            email: normalizedEmail
        });

        if (!pending) {
            return res.status(400).json({
                message: "No pending registration found. Please register again."
            });
        }

        const elapsed = Date.now() - pending.lastOtpSentAt.getTime();
        const cooldownRemaining = OTP_RESEND_COOLDOWN_MS - elapsed;

        if (cooldownRemaining > 0) {
            return res.status(429).json({
                message: `Please wait ${Math.ceil(cooldownRemaining / 1000)} seconds before resending.`,
                cooldownSeconds: Math.ceil(cooldownRemaining / 1000)
            });
        }

        const otp = generateOtp();
        const otpHash = hashOtp(otp);

        pending.otpHash = otpHash;
        pending.otpExpires = Date.now() + OTP_EXPIRY_MS;
        pending.otpAttempts = 0;
        pending.lastOtpSentAt = Date.now();
        await pending.save();

        await sendEmail({
            to: normalizedEmail,
            subject: "Taru Foundation - Email Verification OTP",
            text: `
Your Taru Foundation verification code is: ${otp}

This code will expire in 10 minutes.

If you did not request this, you can safely ignore this email.
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2>Taru Foundation</h2>
                    <p>Your email verification code is:</p>
                    <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #166534;">
                        ${otp}
                    </p>
                    <p>This code will expire in <strong>10 minutes</strong>.</p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                </div>
            `
        });

        res.status(200).json({
            message: "A new verification OTP has been sent to your email.",
            email: normalizedEmail
        });

    } catch (error) {
        console.error("Resend OTP error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerStatus: user.sellerStatus || "NONE",
                shgName: user.shgName || "",
                phone: user.phone || "",
                address: user.address || ""
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// APPLY TO BECOME SELLER
const applySeller = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Admins cannot become sellers
        if (user.role === "admin") {
            return res.status(403).json({
                message: "Administrators cannot apply to become sellers"
            });
        }

        // Already approved sellers cannot re-apply
        if (
            user.role === "seller" &&
            user.sellerStatus === "APPROVED"
        ) {
            return res.status(400).json({
                message: "You are already a verified active seller"
            });
        }

        // Pending application
        if (user.sellerStatus === "PENDING") {
            return res.status(400).json({
                message: "Your seller application is already pending administrator review"
            });
        }

        const {
            name,
            phone,
            address,
            shgName,
            shgRegNumber,
            district,
            state,
            membersCount,
            description,
            craftCategories
        } = req.body;

        if (!shgName || !shgName.trim()) {
            return res.status(400).json({
                message: "Self-Help Group (SHG) / Collective Name is required"
            });
        }

        if (name && name.trim()) user.name = name.trim();
        if (phone && phone.trim()) user.phone = phone.trim();
        if (address && address.trim()) user.address = address.trim();

        user.shgName = shgName.trim();

        if (shgRegNumber) user.shgRegNumber = shgRegNumber.trim();
        if (district) user.district = district.trim();
        if (state) user.state = state.trim();
        if (membersCount) user.membersCount = membersCount.trim();
        if (description) user.description = description.trim();

        if (Array.isArray(craftCategories)) {
            user.craftCategories = craftCategories;
        }

        user.role = "buyer";
        user.sellerStatus = "PENDING";

        await user.save();

        res.status(200).json({
            message: "Seller application submitted successfully! It is pending admin approval.",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerStatus: user.sellerStatus,
                shgName: user.shgName,
                phone: user.phone,
                address: user.address,
                district: user.district,
                state: user.state,
                membersCount: user.membersCount,
                description: user.description,
                craftCategories: user.craftCategories
            }
        });

    } catch (error) {
        console.error("Apply seller error:", error.message);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        // Do not reveal whether the email exists.
        if (!user) {
            return res.status(200).json({
                message: "If an account exists with this email, a password reset link has been sent."
            });
        }

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store a hashed version in database
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;

        // Token expires after 15 minutes
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Frontend URL
        const frontendURL =
            process.env.FRONTEND_URL || "http://localhost:5173";

        const resetURL =
            `${frontendURL}/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,

            subject: "Taru Foundation - Password Reset",

            text: `
You requested a password reset for your Taru Foundation account.

Use the following link to reset your password:

${resetURL}

This link will expire in 15 minutes.

If you did not request this password reset, you can safely ignore this email.
            `,

            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

                    <h2>Taru Foundation</h2>

                    <p>
                        You requested a password reset for your Taru Foundation account.
                    </p>

                    <p>
                        Click the button below to create a new password:
                    </p>

                    <a
                        href="${resetURL}"
                        style="
                            display: inline-block;
                            padding: 12px 20px;
                            background: #166534;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                        "
                    >
                        Reset Password
                    </a>

                    <p>
                        This link will expire in <strong>15 minutes</strong>.
                    </p>

                    <p>
                        If you did not request this password reset,
                        you can safely ignore this email.
                    </p>

                </div>
            `
        });

        return res.status(200).json({
            message: "If an account exists with this email, a password reset link has been sent."
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            message: "Unable to process password reset request"
        });
    }
};
// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Hash the token received from the reset URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with matching token that has not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Password reset link is invalid or has expired"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        user.password = hashedPassword;

        // Invalidate reset token
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.status(200).json({
            message: "Password reset successful. You can now login with your new password."
        });

    } catch (error) {
        console.error("Reset password error:", error);

        res.status(500).json({
            message: "Unable to reset password"
        });
    }
};


module.exports = {
    registerUser,
    verifyOtp,
    resendOtp,
    loginUser,
    applySeller,
    resetPassword,
    forgotPassword

};