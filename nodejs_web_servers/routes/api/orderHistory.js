const express = require('express');
const router = express.Router();
const checkoutController = require('../../controllers/checkoutController');
const verifyJWT = require('../../middleware/verifyJWT');
const Checkout = require('../../model/Checkout');

//router.use(authMiddleware.authenticate);


// Submit new Checkout Order
const addCheckoutOrder = async (req, res) => {
    const { orderNumber, userEmail, total } = req.body;
    const delivered = "Preparing"; // Default status

    if (!orderNumber || !total) {
        return res.status(400).json({message: 'Missing required fields: orderNumber and total are required'});
    }

    try {
        const newOrder = new Checkout({ 
            orderNumber, 
            userEmail, 
            total, 
            delivered 
        });
        
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Error submitting Order', err);
        
        // Handle duplicate order numbers
        if (err.code === 11000) {
            return res.status(400).json({ 
                message: 'Order number already exists' 
            });
        }
        
        res.status(500).json({ 
            message: 'Server error while processing your order' 
        });
    }
};

/**
 * @route POST /api/orderhistory
 * @desc Create a new order (uses addCheckoutOrder)
 * @access Private
 */
router.post('/', addCheckoutOrder);

/**
 * @route GET /api/orderhistory
 * @desc Get all orders for the authenticated user
 * @access Private
 */
router.get('/', async (req, res) => {
    try {
        const userEmail = req.user.email;
        const orders = await Checkout.find({ userEmail }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order history', error: error.message });
    }
});


/**
 * @route GET /api/orderhistory/:orderNumber
 * @desc Get specific order details by order number
 * @access Private
 */
router.get('/:orderNumber', async (req, res) => {
    try {
        const userEmail = req.user.email;
        const orderNumber = req.params.orderNumber;
        
        const order = await Checkout.findOne({ 
            userEmail, 
            orderNumber 
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order details', error: error.message });
    }
});



module.exports = router;
