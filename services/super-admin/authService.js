const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../models/super-admin/user');
const emailService = require('../../utils/emailService');

const create = async (body) => {
    let {name, email, password} = body;
    let check_email = await User.findByEmail(email);
    if(check_email.length > 0){
        throw new Error('Email already exists');
    }

    // Hash pasword
    const hashedPWD = await bycrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(37).toString('hex');
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    let result = await User.create({
        name: name,
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

const resetAdminPassword = async (id, newPassword) =>{
    const admin = await User.findById(id);
    if(admin.length === 0){
        throw new Error('Admin account not found');        
    }

    const hashedPWD = await bycrypt.hash(newPassword, 10);
    await User.updatePassword(id, hashedPWD);

    return {id: id, email: admin[0].email};
}

module.exports = {
    create,
    adminStatus,
    resetAdminPassword
}