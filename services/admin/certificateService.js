const dbConfig = require('../../config/db');
const certificate = require('../../models/admin/certificate');
const { v4: uuidv4 } = require('uuid');
const generateQRCode = require('../../utils/qrcode');
const generateCertificatePDF = require('../../utils/pdf');
const { sendCertificateEmail } = require('../../utils/emailService');

const issueCertificate = async (studentId) => {
    const qrToken = uuidv4();

    await certificate.create(studentId, qrToken);
    const verificationUrl = `${dbConfig.appUrl}/api/certificates/verify?token=${qrToken}`;
    const qrCodeDataUrl = await generateQRCode(verificationUrl);

    return {
        qrToken,
        verificationUrl,
        qrCodeDataUrl
    };

}

const processScanAndGetBinary = async (token) => {
    const certData = await certificate.findByToken(token);
    if (!certData) {
        throw new Error('Certificate validity check failed: Invalid token');
    }
    if (!certData.email) {
        throw new Error('Student email not found for this certificate');
    }
    const pdfStream = generateCertificatePDF(certData);

    const chunks = []; // Collect PDF data chunks
    const pdfBuffer = await new Promise((resolve, reject) => {
        pdfStream.on('data', chunk => chunks.push(chunk));
        pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
        pdfStream.on('error', err => reject(err));
    });

    const verificationUrl = `${dbConfig.appUrl}/api/certificates/verify?token=${token}`;
    try {
        await sendCertificateEmail(
            certData.email,
            certData.fullname,
            pdfBuffer,
            verificationUrl,
        );
    } catch (error) {
        console.error(`mail delivery failed: ${certData.email}`, error);
        throw new Error('Certificate generated, but email delivery failed');
    }

    return {
        filename: `Certificate_${certData.fullname.replace(/\s+/g, '_')}.pdf`,
        pdfBuffer
    }
}

module.exports = {
    issueCertificate,
    processScanAndGetBinary
};