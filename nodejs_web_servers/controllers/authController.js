const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body; // Use email instead of username
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });
    
    // Check if email exists
    const foundUser = await User.findOne({ email }).exec(); // Find by email

    if (!foundUser) {
        return res.sendStatus(401); // Unauthorized if no user found
    }

    // Evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // Create JWTs
        const accessToken = jwt.sign(
            { "UserInfo": { "email": foundUser.email, "roles": roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Save refreshToken with the current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, secure:true, sameSite:'None', maxAge: 24 * 60 * 60 * 1000 }); // Set cookie for 1 day
        res.json({ accessToken }); // Send access token as response
    } else {
        res.sendStatus(401); // Unauthorized if password doesn't match
    }
};

module.exports = { handleLogin };