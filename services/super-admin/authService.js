const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../models/super-admin/user');
const emailService = require('../../utils/emailService');
const Attempt = require('../../models/admin/attempt');
const { generateRandomToken, hashToken } = require('../../utils/generateToken');
const {sendResetLinkEmail, sendPasswordResetSuccessEmail} = require('../../utils/emailService');

const create = async (body) => {
    let {fullname, email, password} = body;
    let check_email = await User.findByEmail(email);
    if(check_email.length > 0){
        throw new Error('Email already exists');
    }

    // Hash pasword
    const hashedPWD = await bycrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(37).toString('hex');
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    let result = await User.create({
        fullname: fullname,
        email: email,
        password: hashedPWD,
        verificationToken: verificationToken,
        verificationExpires: verificationExpires,
    });

    await emailService.sendVerificationEmail(email, verificationToken)

    let rows = await User.findById(result);
    return rows;
}

const adminStatus = async (id, status) => {
    let admin = await User.findById(id);
    if(admin.length === 0){
        throw new Error('Admin account not found');
    }

    await User.updateStatus(id, status);
    let updatedRow = await User.findById(id);
    return updatedRow[0];
}

const requestPasswordReset = async (email) => {
    const users = await User.findByEmail(email);
    if(users.length === 0){
        throw new Error('Admin account not found');
    }
    
    const plainText = generateRandomToken();
    const hashedToken = hashToken(plainText);

    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await User.saveResetToken(users[0].id, hashedToken, expires);

    await sendResetLinkEmail(users[0].email, plainText);
    return {success: true, message: 'Password reset link has been sent to your email'};
}

const verifyAndResetPassword = async (plainToken, newPassword) => {
    const hashedToken = hashToken(plainToken);
    const userRows = await User.findUserByToken(hashedToken);
    if(userRows.length === 0){
        throw new Error('Invalid or expired reset token');
    }
    
    const user = userRows[0];
    const hashedPWD = await bycrypt.hash(newPassword, 10);
    await User.updatePasswordAndClearToken(user.id, hashedPWD);
    await sendPasswordResetSuccessEmail(user.email);
    return {success: true, message: 'Password has been reset successed'};
}

const unlockAccount = async (email) => {
    const rows = await Attempt.isPermanentlyBlocked(email);

    if (rows.length === 0) {
        throw new Error(`No permanently blocked account found for ${email}`);
    }

    await Attempt.unlockAccount(email);
};

module.exports = {
    create,
    adminStatus,
    requestPasswordReset,
    verifyAndResetPassword,
    unlockAccount
}