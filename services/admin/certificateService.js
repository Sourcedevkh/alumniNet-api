const { pool } = require('../../config/db');
const certificate = require('../../models/admin/certificate');


const createCertificate = async (body) => {
    if(!body.student_id){
        throw new Error('Student ID is required');
    }
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
    if(!id) {
        throw new Error('Certificate ID is required');
    }

    let existing = await certificate.getCertificateById(id);
    if(!existing) {
        throw new Error('Certificate not found');
    }

    const [result] = await pool.query('DELETE FROM certificates WHERE id = ?', [id]);
    return result;
}

const getCertificateById = async (id) => {
    if(!id) {
        throw new Error('Certificate ID is required');
    }

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