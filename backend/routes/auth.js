import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import User from '../models/User.js';

const router = Router();
const jwtSecret = process.env.JWT_SECRET;


// Middleware for authenticating tokens
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

// Middleware for checking admin access
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

// Endpoint to register a new user
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, isAdmin = false } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, username, password: hashedPassword, isAdmin });
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
        
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { authenticateToken, isAdmin };
export default router;