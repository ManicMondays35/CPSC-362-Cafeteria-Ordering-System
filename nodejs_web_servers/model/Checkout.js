const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
    orderNumber: {type: String, required: true},
    userEmail: {type: String, required: true},
    total: {type: Number, required: true},
    delivered: {type: String, default: "Preparing"}
});

const Checkout = mongoose.model('checkout', checkoutSchema);
module.exports = Checkout;