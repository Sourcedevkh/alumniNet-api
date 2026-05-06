const jwtConfig = require('../../config/jwt');
const User = require('../../models/admin/user'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {sendOTPEmail} = require('../../utils/emailService');
const {generateOTP, getOTPExpiry} = require('../../utils/generateOTP');

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

    await User.updateLoginTime(userInfo[0].id);
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

const resendVerificationLink = async (email) => {
    let userInfo = await User.findByEmail(email);
    if(userInfo.length === 0){
        throw new Error('Email not found');
    }

    if(userInfo[0].is_verified){
        throw new Error('Email already verified');
    }

    const verification_token = crypto.randomBytes(37).toString('hex');
    const verification_expires = new Date(Date.now() + 60 * 60 * 1000); //60min or 1h

    await User.resendVerificationLink({
        id: userInfo[0].id,
        verification_token,
        verification_expires
    })

    await emailService.sendVerificationEmail(email, verification_token);
    return {message: 'Verification email sent, Please check your inbox'};
    
}

const logout = async (id) => {
    await User.removeToken(id);
    return true;
}

const requestOTP = async (email) => {
    const user = await User.findByEmail(email);
    if(user.length === 0) throw new Error('Email not found');

    let userInfo = user[0];
    if(!userInfo.is_verified) throw new Error('Please verify your email before requesting OTP');

    let userName = userInfo.name;
    console.log(userName);
    
    const otp = generateOTP();
    const expiresAt = getOTPExpiry(10);

    await User.saveOTP(email, otp, expiresAt);
    await sendOTPEmail(email, otp, userName);
    return true;
}

const verifyOTP = async (email, code) => {
    const userRows = await User.findByEmail(email); 
    
    if (userRows.length === 0) {
        throw new Error('Invalid OTP or OTP has expired');
    }

    const userInfo = userRows[0];
    if (userInfo.otp_code === null) {
        throw new Error('OTP already verified');
    }

    if (userInfo.otp_code === null || userInfo.otp_code !== code || new Date(userInfo.otp_expires_at) < new Date()) {
        throw new Error('Invalid OTP or OTP has expired');
    }

    // Generate shortToken 32-character hex string
    const reset_token = crypto.randomBytes(16).toString('hex');
    await User.saveResetToken(userInfo.id, reset_token);
    
    await User.clearOTP(userInfo.id);

    return reset_token;
};

const resetPWD = async (token, newPassword) => {
    try {
        const userRows = await User.findByResetToken(token);
        const user = userRows[0];

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // hash the new password
        const hashedPWD = await bcrypt.hash(newPassword, 10);
        
        await User.updatePassword(user.id, hashedPWD);

        return true;
    } catch (error) {
        throw new Error(error.message); 
    }
}

module.exports = {
    login,
    getMe,
    verifyEmail,
    resendVerificationLink,
    logout,
    requestOTP,
    verifyOTP,
    resetPWD
}