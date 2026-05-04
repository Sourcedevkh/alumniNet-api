const User = require('../../models/super-admin/user');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const create = async (body) => {
    let check_email = await User.findByEmail(body.email);
    if(check_email.length > 0){
        throw new Error('Email already exists');
    }

    // Hash pasword
    const hashedPWD = await bycrypt.hash(body.password, 10);
    const verificationToken = crypto.randomBytes(37).toString('hex');
    const verificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let result = await User.create({
        name: body.name,
        email: body.email,
        password: hashedPWD,
        verificationToken: verificationToken,
        verificationExpires: verificationExpires,
    });
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

module.exports = {
    create,
    adminStatus
}