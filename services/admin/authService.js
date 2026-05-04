const User = require('../../models/admin/user'); 

const login = async (body) => {
    let userInfo = await User.findByEmail(body.email);
    if(userInfo.length === 0){
        throw new Error('Email and Password invalid');
    }
    console.log(userInfo);
    
}

const getMe = async (id) => {
    let data = await User.findById(id);
    if(data.length === 0){
        throw new Error('User not found');
    }
    
    return data;
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