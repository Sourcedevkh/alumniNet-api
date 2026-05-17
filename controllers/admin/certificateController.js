const certificateService = require('../../services/admin/certificateService');
const { sendResponse } = require('../../utils/responseHelper');
const getCertificateSuccessHtml = require('../../utils/certificateSuccessHtml');

const createCertificate = async (req, res) => {
    try {
        let result = await certificateService.createCertificate(req.body);
        sendResponse(res, 201, true, 'Certificate created successfully', result);
    }catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}

const getAllCertificates = async (req, res) => {
    try {
        let result = await certificateService.getAllCertificates();
        sendResponse(res, 200, true, 'Certificates retrieved successfully', result);
    }catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}

const deleteCertificate = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.body;
        let result = await certificateService.deleteCertificate(id,body);
        sendResponse(res, 200, true, 'Delete certificate successfully', result);
    }catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}

const getCertificateById = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await certificateService.getCertificateById(id);
        sendResponse(res, 200, true, 'Certificate get by id successfully', [result]);
    }catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}

// ----- new handler
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
    createCertificate,
    getAllCertificates,
    deleteCertificate,
    getCertificateById,

    generateAdminQR,
    handleCertificateScan
};