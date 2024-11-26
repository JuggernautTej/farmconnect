import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import User from '../models/User.js';

const router = Router();
const jwtSecret = process.env.JWT_SECRET;

// Endpoint to register a new user
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, username, password } = req.body;
        const user = new User({ firstName, lastName, email, username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, jwtSecret);
        res.status(200).json({ token });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;