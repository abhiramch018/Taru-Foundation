const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;

        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Disallow public users from directly assigning privileged roles.
        // Role is always 'buyer' upon initial registration.
        // If registering as seller, set sellerStatus to 'PENDING' for admin approval.
        const isSellerApplication = role === "seller";
        const assignedRole = "buyer";
        const assignedSellerStatus = isSellerApplication ? "PENDING" : "NONE";

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: assignedRole,
            sellerStatus: assignedSellerStatus
        });

        res.status(201).json({
            message: isSellerApplication
                ? "Seller application submitted successfully! It is pending admin approval."
                : "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerStatus: user.sellerStatus
            }
        });

    } catch (error) {
        console.error("Error registering user:", error.message);

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

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT with verified database role
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

        // Send response
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


// APPLY TO BECOME SELLER (POST /api/auth/apply-seller)
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
        if (user.role === "seller" && user.sellerStatus === "APPROVED") {
            return res.status(400).json({
                message: "You are already a verified active seller"
            });
        }

        // Pending applications
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

        // Update real user profile and seller details
        if (name && name.trim()) user.name = name.trim();
        if (phone && phone.trim()) user.phone = phone.trim();
        if (address && address.trim()) user.address = address.trim();
        user.shgName = shgName.trim();
        if (shgRegNumber) user.shgRegNumber = shgRegNumber.trim();
        if (district) user.district = district.trim();
        if (state) user.state = state.trim();
        if (membersCount) user.membersCount = membersCount.trim();
        if (description) user.description = description.trim();
        if (Array.isArray(craftCategories)) user.craftCategories = craftCategories;

        // Role remains buyer during application; sellerStatus becomes PENDING
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


module.exports = {
    registerUser,
    loginUser,
    applySeller
};