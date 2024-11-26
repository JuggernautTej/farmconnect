import express from 'express';
import Category from '../models/Category.js';

const router = Router();

// Middleware to check admin access
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

// Endpoint to retrieve all categories - GET Method
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// Endpoint to retrieve a category by ID - GET Method
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category' });
    }
});

// Endpoint to add a new category by the Admin only - POST Method
router.post('/', isAdmin, async(req, res) => {
    try {
        const category = new Category(req.body);
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error creating category', error});
    }
});

// Endpoint to update a category by ID by the Admin only - PUT Method
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedCategory) return res.status(400).json({ message: 'Category not found' });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error uppdating category', error });
    }
});

// Endpoint to delete a category by ID by the Admin only - DELETE Method
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted succesfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
});

export default router;