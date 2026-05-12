const { pool } = require('../../config/db');


const getAllCertificates = async () => {
    const [rows] = await pool.query(`
        SELECT 
            c.id,
            c.student_id,
            s.name AS student_name,
            c.issued_at,
            c.created_at,
            c.updated_at
        FROM certificates c
        JOIN students s 
            ON c.student_id = s.id
    `);

    return rows;
}
const checkIdExists = async (student_id) => {
    const [rows] = await pool.query('SELECT id FROM certificates WHERE student_id = ?', [student_id]);
    return rows;
}


const getCertificateById = async (id) => {
     const [rows] = await pool.query(`
        SELECT 
            c.id,
            c.student_id,
            s.name AS student_name,
            c.issued_at,
            c.created_at,
            c.updated_at
        FROM certificates c
        JOIN students s 
            ON c.student_id = s.id
        WHERE c.id = ?
    `, [id]);

    return rows[0];
}
const createCertificate = async (body) => {

    const [result] = await pool.query(
        'INSERT INTO certificates (student_id, issued_at) VALUES (?, ?)',
        [body.student_id, body.issued_at]
    );

    const [rows] = await pool.query(`
        SELECT 
            c.id,
            c.student_id,
            s.name AS student_name,
            c.issued_at,
            c.created_at,
            c.updated_at
        FROM certificates c
        JOIN students s 
            ON c.student_id = s.id
        WHERE c.id = ?
    `, [result.insertId]);

    return rows[0];
};

const deleteCertificate = async (id) => {
    let [rows] = await pool.query('DELETE FROM certificates WHERE id = ?', [id]);
        
    return rows[0];
}

module.exports = {
    getAllCertificates,
    checkIdExists,
    getCertificateById,
    createCertificate,
    deleteCertificate
};  