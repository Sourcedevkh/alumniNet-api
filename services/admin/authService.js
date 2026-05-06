const jwtConfig = require('../../config/jwt');
const User = require('../../models/admin/user'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const emailService = require('../../utils/emailService');

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

const getScholarships = async () => {
    let rows = await User.getScholar_types();

    return rows;
}

const createScholarshipType = async (body) => {

    if (!body.name) {
        throw new Error('Name is required');
    }
    let name = body.name.trim();
    let existing = await User.findScholarshipTypeByName(name);
    if (existing.length > 0) {
        throw new Error('Scholarship type already exists');
    }

    let result = await User.createScholarshipType({ name });
    return result;
}


const updateScholarshipType = async (id, body) => {
    if (!body.name) {
        throw new Error ('Name is required');
    }
    if (body.name.trim() === '') {
        throw new Error('Name Scholarship not found');
    }
    let name = body.name.trim();
    let existing = await User.findScholarshipTypeByName(name);
    if (existing.length > 0 && existing[0].id !== parseInt(id)) {
        throw new Error('Scholarship type already exists');
    }
    let result = await User.updateScholarshipType(id, { name });

    if (result.length === 0) {
        throw new Error('Scholarship type ID not found');
    }
    return result;
}

const deleteScholarshipType = async (id) => {
    let result = await User.deleteScholarshipType(id);
    if (result.affectedRows === 0) {
        throw new Error('Scholarship type ID not found');
    }
    return result[0];
}
module.exports = {
    login,
    getMe,
    verifyEmail,
    resendVerificationLink,
    getScholarships,
    createScholarshipType,
    updateScholarshipType,
    deleteScholarshipType
}