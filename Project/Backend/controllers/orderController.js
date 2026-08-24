const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        // 1. Get buyer's cart
        const cart = await Cart.findOne({
            buyer: req.user.id
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        // 2. Check every product in cart
        for (const item of cart.items) {

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.status !== "APPROVED") {
                return res.status(400).json({
                    message: `${product.name} is not available`
                });
            }

            // 3. Check stock again
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }

            // 4. Get real price from database
            const price = product.price;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: price
            });

            totalAmount += price * item.quantity;

            // 5. Reduce stock
            product.stock -= item.quantity;

            // UNIQUE product
            if (product.type === "UNIQUE" && product.stock === 0) {
                product.status = "SOLD";
            }

            await product.save();
        }

        // 6. Create order
        const order = await Order.create({
            buyer: req.user.id,
            items: orderItems,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
            paymentStatus: "PENDING",
            orderStatus: "PLACED"
        });

        // 7. Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        console.error("Create order error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            buyer: req.user.id
        })
        .populate("items.product", "name price images type")
        .sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {

        console.error("Get orders error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getOrderById = async (req, res) => {
    try {

        const order = await Order.findOne({
            _id: req.params.id,
            buyer: req.user.id
        })
        .populate("items.product", "name price images type");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);

    } catch (error) {

        console.error("Get order error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};