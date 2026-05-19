const certificateService = require('../../services/admin/certificateService');
const { sendResponse } = require('../../utils/responseHelper');
const getCertificateSuccessHtml = require('../../utils/certificateSuccessHtml');


const generateAdminQR = async (req, res) => {
    try {
        const {student_id} = req.body;
        const registrationResult = await certificateService.issueCertificate(student_id);
        return sendResponse(res, 200, true, 'Certificate issued successed', registrationResult);
    } catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}

const handleCertificateScan = async (req, res) => {
    try {
        const {token} = req.query;
        await certificateService.processScanAndGetBinary(token);
        res.setHeader('Content-Type', 'text/html');
        res.send(getCertificateSuccessHtml());
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    generateAdminQR,
    handleCertificateScan
};