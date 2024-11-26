import { Router } from 'express';
import Category from '../models/Category.js';
import { authenticateToken, isAdmin } from './auth.js';

const router = Router();

// Endpoint to retrieve all categories - GET Method
router.get('/', authenticateToken, async (req, res) => {
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
router.post('/', authenticateToken, isAdmin, async(req, res) => {
    try {
        const category = new Category(req.body);
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error creating category', error});
    }
});

// Endpoint to update a category by ID by the Admin only - PUT Method
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
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
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted succesfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
});

export default router;