import Product from '../models/Product.js';
import { Router } from 'express';

const router = Router();

// Endpoint to retrieve all products - GET Method
router.get('/', async (req, res) => {
    try {
        const products = Products.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products'});
    }
});

// Endpoint to retrieve product by id - GET Method
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Endpoint to retrieve all products by category - GET Method
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        if (products.length === 0) return res.status(404).json({ message: 'No product found in this category' });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by category' });
    }
});

// Endpoint to retrieve a single product by the ID within a category - GET Method
router.get('/:category/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, category: req.params.category });
        if (!product) return res.status(404).json({ message: 'No product found in this category' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
})


// Endpoint to add a new product - POST Method
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product' });
    }
});

// Endpoint to update a product by its ID - PUT Method
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updatedProduct);    
    } catch (error) {
        res.status(400).json({ messgae: 'Error updating product' });
    }
});

// Endpoint to delete product by ID - DELETE Method
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ messgae: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

export default router;