const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require('../config/jwt');
const User = require("../models/admin/user");

const verifyPassword = async (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
};

const generateAndStoreToken = async (userId, email, deviceId, role) => {
    const token = jwt.sign(
        { id: userId, email, device_id: deviceId, role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );
    await User.addToken(token, userId);
    return token;
};

module.exports = { verifyPassword, generateAndStoreToken };