const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/admin/user');
const { sendResponse } = require('../utils/responseHelper');


const isLogin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader){
            return sendResponse(res, 401, false, 'You needs to login');
        }

        let parts = authHeader.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer'){
            return sendResponse(res, 401, false, 'Invalid token');
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
        return sendResponse(res, 401, false, error.message);
    }
};

module.exports = {
    isLogin
};