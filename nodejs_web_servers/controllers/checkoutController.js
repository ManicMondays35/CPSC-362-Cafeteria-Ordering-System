const Checkout = require('../model/Checkout');

// Submit new Checkout Order
const addCheckoutOrder = async (req, res) => {
    const { orderNumber, userEmail, total, delivered } = req.body;

    if (!orderNumber || !userEmail || !total || !delivered) {
        return res.status(400).json({message: 'An Error occurred with order#, email, total, or delivery staus'});
    }

    try {
        const newOrder = new Checkout({orderNumber, userEmail, total, delivered });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Error submitting Order', err);
        res.status(500).json({ message: 'Server error'});
    }
};