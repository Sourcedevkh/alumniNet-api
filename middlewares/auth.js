const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/admin/user');

const isLogin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader) {
            return res.json({
                result: false,
                msg: 'You need to login'
            })
        }

        let parts = authHeader.split(' ');
        console.log(parts);
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.json({
                result: false,
                msg: 'Invalid Token'
            })
        }

        let token = parts[1];
        let decode = jwt.verify(token, jwtConfig.secret);
        //console.log(decode);

        // Check if token exists in database
        let row = await User.getToken(token);
        console.log(row);
        
        if(row.length == 0){
            throw new Error('Invalid Token or Token Expired');
        }

        req.user = decode;

        next();

    } catch (error) {
        return res.status(401).json({
            result: false,
            msg: 'Invalid Token or Token Expired'
        })
    }
}

module.exports = {
    isLogin
}