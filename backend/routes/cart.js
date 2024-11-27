import { Router } from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import router, { authenticateToken } from "./auth";

const router = Router();

// Middleware to find user (key assumption: user ID is available in req.user from authentication middleware)
const findUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        if (!user) return res.status(404).json({ message: 'User not found' });
        req.userDetails = user;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Endpoint to retrieve all cart items - GET Method
router.get('/', authenticateToken, findUser, (req, res) => {
    res.status(200).json( req.userDetails.cart );
});

// Endpoint to add an item to the cart - POST Method
router.post('/add', authenticateToken, findUser, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const existingItem = req.userDetails.cart.find(
            (item) => item.product._id.toString() === productId
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            req.userDetails.cart.push({ product: productId, quantity });
        }

        await req.userDetails.save();
        res.status(200).json(req.userDetails.cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to remove an item from the cart - DELETE Method
router.delete('/remove/:productId', authenticateToken, findUser, async (req, res) => {
    try {
        req.userDetails.cart = req.userDetails.cart.filter(
            (item) => item.product._id.toString() !== req.params.productId
        );
        await req.userDetails.save();
        res.status(200).json(req.userDetails.cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update cart item quantity - PATCH Method
router.patch('/update/:productId', authenticateToken, findUser, async (req, res) => {
    try {
        const { quantity } = req.body;

        const cartItem = req.userDetails.cart.find(
            (item) => item.product._id.toString() === req.params.productId
        );

        if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });
        cartItem.quantity = quantity;
        await req.userDetails.save();
        res.status(200).json(req.userDetails.cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to clear the cart - DELETE Method
router.delete('/clear', authenticateToken, findUser, async (req, res) => {
    try {
        req.userDetails.cart = [];
        await req.userDetails.save();
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
