const Cart=require("../models/Cart");
const Product=require("../models/Product");
// ADD ITEM TO CART
const addToCart=async(req,res)=>{
    try{
        const {productId,quantity}=req.body;
        if(!productId || !quantity){
            return res.status(400).json({
                message:"Product ID and quantity are required"
            });
        }
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                message:"Product not found"
            });
        }
        if(product.status!=="APPROVED"){
            return res.status(400).json({
                message:"Product is not approved for sale"
            });
        }
        if(product.stock<quantity){
            return res.status(400).json({
                message:"Insufficient stock"
            });
        }
        let cart = await Cart.findOne({ buyer: req.user.id || req.user._id });
        if (!cart) {
            cart = await Cart.create({
                buyer: req.user.id || req.user._id,
                items: [
                    {
                        product: productId,
                        quantity: quantity
                    }
                ]
            });
            return res.status(201).json({
                message: "Cart created and item added successfully",
                cart
            });
        }
        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: quantity
            });
        }
        await cart.save();
        res.status(200).json({
            message: "Item added to cart successfully",
            cart
        });
    }catch(error){
        console.error("Add to cart error:", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }

}
//Get Cart Items
const getCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            buyer: req.user.id
        }).populate(
            "items.product",
            "name price images stock type"
        );

        if (!cart) {
            return res.status(200).json({
                buyer: req.user.id,
                items: []
            });
        }

        res.status(200).json(cart);

    } catch (error) {
        console.error("Get cart error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// UPDATE CART ITEM
const updateCartItem = async (req, res) => {
    try {

        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Quantity exceeds available stock"
            });
        }

        const cart = await Cart.findOne({
            buyer: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not in cart"
            });
        }

        item.quantity = quantity;

        await cart.save();

        res.status(200).json({
            message: "Cart updated successfully",
            cart
        });

    } catch (error) {
        console.error("Update cart error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// REMOVE PRODUCT FROM CART
const removeFromCart = async (req, res) => {
    try {

        const { productId } = req.params;

        const cart = await Cart.findOne({
            buyer: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemExists = cart.items.some(
            item => item.product.toString() === productId
        );

        if (!itemExists) {
            return res.status(404).json({
                message: "Product not in cart"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json({
            message: "Product removed from cart",
            cart
        });

    } catch (error) {
        console.error("Remove from cart error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
};