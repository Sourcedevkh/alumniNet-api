const jwtConfig = require('../../config/jwt');
const User = require('../../models/admin/user'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (body) => {
    let userInfo = await User.findByEmail(body.email);
    if(userInfo.length === 0){
        throw new Error('Email and Password invalid');
    }

    const isMatch = await bcrypt.compare(body.password, userInfo[0].password);
    if(!isMatch){
        throw new Error('Email and Password invalid');
    }

    if(!userInfo[0].is_verified){
        throw new Error('Please verify your email before logging in');
    }

    const token = jwt.sign(
        // payload
        {
            id: userInfo[0].id,
            email: userInfo[0].email
        },

        // secret key and options
        jwtConfig.secret,
        {expiresIn: jwtConfig.expiresIn}
    );

    // save token to database 
    await User.addToken(token, userInfo[0].id);

    const data = await User.findById(userInfo[0].id);
    const userObejct = data[0];
    return {
        ...userObejct,
        token: token
    }
}

const getMe = async (id) => {
    let data = await User.findById(id);
    if(data.length === 0){
        throw new Error('User not found');
    }
    
    return data[0];
}
    
const verifyEmail = async (token) => {
    if(!token){
        throw new Error('Token is required');
    }

    let userInfo = await User.findByVerificationEmail(token);
    if(userInfo.length === 0){
        throw new Error('Invalid token');
    }

    if(userInfo[0].is_verified){
        throw new Error('Email already verified'); 
    }

    if(!userInfo[0].verification_expires || new Date(userInfo[0].verification_expires) < new Date()){
        throw new Error('Link has expired, Please request a new verification email');
    }

    await User.verifyEmail(userInfo[0].id);
    return {message: 'Email verified successed'};
}

module.exports = {
    login,
    getMe,
    verifyEmail,
}