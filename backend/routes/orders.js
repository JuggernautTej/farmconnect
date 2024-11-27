import { Router } from "express";
import Order from '../models/Order.js';
import User from "../models/User.js";
import { authenticateToken, isAdmin } from './auth.js';

const router = Router();

// Middleware to find user and populate cart
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

// Endpoint to Place an order - POST Method
router.post('/place', authenticateToken, findUser, async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (!req.userDetails.cart.length) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // Calculate total price
        const totalPrice = req.userDetails.cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        // Create order
        const order = new Order({
            user: req.userDetails._id,
            products: req.userDetails.cart.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalPrice,
            shippingAddress,
            paymentMethod,
        });

        await order.save();

        // Clear the cart after placing the order
        req.userDetails.cart = [];
        await req.userDetails.save();

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to retrieve all orders for the logged-in user - GET Method
router.get('/', authenticateToken, findUser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userDetails._id }).populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update order status (Admin only) - PATCH Method
router.patch('/:orderId/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Endpoint to retrieve all orders (Admin only) - GET Method
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
    try {
      const orders = await Order.find().populate('user', 'username email').populate('products.product');
      res.status(200).json(orders);  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;