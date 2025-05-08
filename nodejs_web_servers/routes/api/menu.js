const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/menuController');
const verifyJWT = require('../../middleware/verifyJWT');
const Menu = require('../../model/Menu'); // adjust path if needed


// Protect this route with JWT
router.post('/', verifyJWT, menuController.addMenuItem);

// Add the GET route for fetching menu items
router.get('/', async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.json(menuItems); // should return an array of all menu items
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
