const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req,res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken}).exec();

    if (!foundUser){
        return res.sendStatus(403); // forbidden
    }

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { "UserInfo": {
                    "username": decoded.username,
                    "roles": roles

                }  },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '60s' }
            );
            res.json({ accessToken });
        }
    );
    

        
}

    

 module.exports = {handleRefreshToken}
// no nested pgs in final
// no hypervisor on final