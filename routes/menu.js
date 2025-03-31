const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Create a new menu item
router.post('/', async (req, res) => {
    try {
        const { text, url, parent } = req.body;
        const menu = new Menu({ text, url, parent });
        await menu.save();
        res.status(201).json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all menu items with parent-child structure
router.get('/', async (req, res) => {
    try {
        const menus = await Menu.find().populate('parent');
        
        // Xây dựng cấu trúc phân cấp
        const buildTree = (items, parentId = null) => {
            const result = [];
            for (let item of items) {
                if (String(item.parent?._id || null) === String(parentId)) {
                    const children = buildTree(items, item._id);
                    if (children.length) {
                        item._doc.children = children;
                    }
                    result.push(item);
                }
            }
            return result;
        };

        const menuTree = buildTree(menus);
        res.json(menuTree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single menu item by ID
router.get('/:id', async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id).populate('parent');
        if (!menu) return res.status(404).json({ message: 'Menu not found' });
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a menu item
router.put('/:id', async (req, res) => {
    try {
        const { text, url, parent } = req.body;
        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            { text, url, parent },
            { new: true }
        );
        if (!menu) return res.status(404).json({ message: 'Menu not found' });
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);
        if (!menu) return res.status(404).json({ message: 'Menu not found' });
        res.json({ message: 'Menu deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;