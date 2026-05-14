const jwtConfig = require('../../config/jwt');
const User = require('../../models/admin/user'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendOTPEmail, sendVerificationEmail } = require('../../utils/emailService');
const { generateOTP, getOTPExpiry } = require('../../utils/generateOTP');
const { checkBlocked, handleFailed, resetAttempt } = require("../../helpers/attemptHelper");
const { verifyPassword, generateAndStoreToken } = require("../../helpers/authHelper");
const { updateUserOnLogin, trackDevice } = require("../../helpers/deviceHelper");
const { logAttempt } = require("../../helpers/loggerHepler");

const login = async (body, device) => {
    const { email, password } = body;
    const { ip, deviceId, userAgent } = device;
    const user = await User.findByEmail(email);
    if (user.length === 0) throw new Error("Email and Password invalid");

    const userData = user[0];
    const userId = userData.id;

    if (!Number(userData.is_verified)) {
        throw new Error("Please verify your email before logging in");
    }
    await checkBlocked(userId, deviceId);

    const isMatch = await verifyPassword(password, userData.password);
    if (!isMatch) {
        await handleFailed(userId, deviceId);         
        await logAttempt(userId, ip, userAgent, false);
        throw new Error("Email and Password invalid");
    }

    await resetAttempt(userId, deviceId);           
    await updateUserOnLogin(userId, ip);
    await trackDevice({ userId, deviceId, userAgent, ip });
    await logAttempt(userId, ip, userAgent, true);

    const token = await generateAndStoreToken(userId, userData.email, deviceId, userData.role);

    return {
        user: { id: userId, fullname: userData.fullname, email: userData.email, role: userData.role },
        token,
        device: { ip, device_id: deviceId },
    };
};

const verifyEmail = async (token) => {
    if (!token) {
        throw new Error('Token is required');
    }

    let userInfo = await User.findByVerificationEmail(token);
    if (userInfo.length === 0) {
        throw new Error('Invalid token');
    }

    if (userInfo[0].is_verified) {
        throw new Error('Email already verified');
    }

    if (!userInfo[0].verification_expires || new Date(userInfo[0].verification_expires) < new Date()) {
        throw new Error('Link has expired, Please request a new verification email');
    }

    await User.verifyEmail(userInfo[0].id);
    return { message: 'Email verified successed' };
}

const resendVerificationLink = async (email) => {
    let userInfo = await User.findByEmail(email);
    if (userInfo.length === 0) {
        throw new Error('Email not found');
    }

    if (userInfo[0].is_verified) {
        throw new Error('Email already verified');
    }

    const verification_token = crypto.randomBytes(37).toString('hex');
    const verification_expires = new Date(Date.now() + 60 * 60 * 1000); //60min or 1h

    await User.resendVerificationLink({
        id: userInfo[0].id,
        verification_token,
        verification_expires
    })

    await sendVerificationEmail(email, verification_token);
    return { message: 'Verification email sent, Please check your inbox' };

}

const logout = async (id) => {
    await User.removeToken(id);
    return true;
}

const requestOTP = async (email) => {
    const user = await User.findByEmail(email);
    if (user.length === 0) throw new Error('Email not found');

    let userInfo = user[0];
    if (!userInfo.is_verified) throw new Error('Please verify your email before requesting OTP');

    let userName = userInfo.fullname;
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
    verifyEmail,
    resendVerificationLink,
    logout,
    requestOTP,
    verifyOTP,
    resetPWD
}