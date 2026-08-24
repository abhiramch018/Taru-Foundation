const Product = require("../models/Product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            images,
            stock,
            type
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            !category ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: "Required product fields are missing"
            });
        }

        // UNIQUE product must have only one unit
        if (type === "UNIQUE" && stock !== 1) {
            return res.status(400).json({
                message: "Unique product must have stock of 1"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            images,
            stock,
            type,
            seller: req.user.id
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Create product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const filter = {};

        if (req.query.seller) {
            filter.seller = req.query.seller;
        } else if (req.query.all === "true") {
            // Admin audit mode: return all statuses
            if (req.query.status) {
                filter.status = req.query.status;
            }
        } else {
            // Public marketplace mode: only approved products
            filter.status = "APPROVED";
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const products = await Product.find(filter)
            .populate("seller", "name email shgName phone address")
            .sort({ createdAt: -1 });

        res.status(200).json(products);

    } catch (error) {
        console.error("Get products error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        ).populate(
            "seller",
            "name email"
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Get product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Make sure seller owns this product
        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only update your own products"
            });
        }

        const {
            name,
            description,
            price,
            category,
            images,
            stock,
            type
        } = req.body;

        if (type === "UNIQUE" && stock !== 1) {
            return res.status(400).json({
                message: "Unique product must have stock of 1"
            });
        }

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.category = category ?? product.category;
        product.images = images ?? product.images;
        product.stock = stock ?? product.stock;
        product.type = type ?? product.type;

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Update product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Make sure seller owns this product
        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own products"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};