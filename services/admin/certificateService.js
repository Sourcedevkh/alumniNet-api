const certificate = require('../../models/admin/certificate');
const generateCertificatePDF = require('../../utils/pdf');

const getCertiByStudentId = async (studentId) => {
    const certData = await  certificate.getCertiDataByStudentId(studentId);
    if(!certData){
        throw  new Error('Student data not found');
    }

    const pdfStream = generateCertificatePDF(certData);
    const pdfBuffer = await new Promise((resolve, reject) => {
        const chunks = [];
        pdfStream.on('data', chunk => chunks.push(chunk));
        pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
        pdfStream.on('error', err => reject(err));
    });

    return {
        pdfBuffer,
        fullname: certData.fullname,
    }
}

module.exports = {
    getCertiByStudentId
};