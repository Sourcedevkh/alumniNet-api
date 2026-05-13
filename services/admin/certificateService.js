const { pool } = require('../../config/db');
const certificate = require('../../models/admin/certificate');


const createCertificate = async (body) => {

    let existing = await certificate.checkIdExists(body.student_id);
    if(existing.length > 0){
        throw new Error('Certificate for this student already exists');
    }

    let result = await certificate.createCertificate(body);
    return result;
};

const getAllCertificates = async () => {
    let result = await certificate.getAllCertificates();

    return result;
};

const deleteCertificate = async (id) => {

    let existing = await certificate.getCertificateById(id);
    if(!existing) {
        throw new Error('Certificate not found');
    }

    let result = await certificate.deleteCertificate(id);
    
    return result;
}

const getCertificateById = async (id) => {
    
    let result = await certificate.getCertificateById(id);
    if(!result) {
        throw new Error('Certificate not found');
    }

    return result;
}
module.exports = {
    createCertificate,
    getAllCertificates,
    deleteCertificate,
    getCertificateById
};