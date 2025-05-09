require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// npm i nodemon jsonwebtoken express dotenv uuid bcrypt cookie-parser cors

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Middleware for URL encoded data: form-data
app.use(express.urlencoded({extended:false}));

// Built-in middleware for JSON
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routes/api/root'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/checkout', require('./routes/api/orderHistory'))
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

// Protected routes (example)
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

// New menu routes
app.use('/menu', require('./routes/api/menu'));

// 404 handler — MUST be last
app.all(/.*/, (req, res) => {
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    if (req.accepts('json')){
        res.json({error: "404 not found"});
    } else{
        res.type('txt').send('404 not found');
    }
});

// Error handling middleware
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });    
});
