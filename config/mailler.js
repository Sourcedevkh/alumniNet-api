const nodemailler = require('nodemailer');

const transporter = nodemailler.createTransport({
    host: 'localhost',
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = transporter;