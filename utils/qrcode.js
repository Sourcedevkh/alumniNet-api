const qrcode = require('qrcode');

const generateQRCode = async (text) => {
    try {
        return await qrcode.toDataURL(text, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300
        });
    } catch (error) {
        throw new Error(`QR Generation Failed: ${error.message}`);
    }
}

module.exports = generateQRCode;    