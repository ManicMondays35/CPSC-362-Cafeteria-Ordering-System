const Menu = require('../model/Menu');

// Create new menu item
const addMenuItem = async (req, res) => {
    const { name, price, image, category, quantity, description } = req.body;

    if (!name || !price || !image || !category || quantity == null || !description) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newItem = new Menu({ name, price, image, category, quantity, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// get array of arrays of menu items with there properties
const getMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find();  // Fetch all menu items from the database
        res.json(menuItems);  // Return the menu items as a JSON response
    } catch (err) {
        console.error('Error fetching menu items:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export both controller functions
module.exports = { addMenuItem, getMenuItems };