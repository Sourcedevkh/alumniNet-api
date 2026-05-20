const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/admin/user');
const {getIP} = require('../helpers/requestHelper');

const isLogin = async (req, res, next) => {
    try {
        const ip = getIP(req);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                result: false,
                msg: "You need to login"
            });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                result: false,
                msg: "Invalid token"
            });
        }

        const token = parts[1];
        const decode = jwt.verify(token, jwtConfig.secret);

        const row = await User.getToken(token);
        if (row.length === 0) {
            throw new Error('Invalid Token or Token Expired');
        }

        req.user = decode;
        req.clientIp = ip;
        next();

    } catch (error) {
        const ip = getIP(req);
        return res.status(401).json({
            result: false,
            msg: "Invalid Token or Token Expired"
        });
    }
};

module.exports = {
    isLogin
}