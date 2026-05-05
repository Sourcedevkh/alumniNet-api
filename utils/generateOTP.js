const crypto = require('crypto');

// Generate OTP 6-digit alphanumeric
const generateOTP = () => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let otp = '';
    
    for (let i = 0; i < 6; i++) {
        const index = crypto.randomInt(0, characters.length);
        otp += characters[index];
    }
    return otp;
};

// otp expire 10 minutes
const getOTPExpiry = (minutes = 10) =>{
    return new Date(Date.now() + minutes * 60000);
}

module.exports = {
    generateOTP,
    getOTPExpiry
}