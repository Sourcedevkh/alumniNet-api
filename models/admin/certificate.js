const { pool } = require('../../config/db');


const getAllCertificates = async () => {
    const [rows] = await pool.query(`
        SELECT 
            c.id,
            c.student_id,
            s.fullname AS student_name,
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
            s.fullname AS student_name,
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
            s.fullname AS student_name,
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


// ------------

const create = async (studentId, qrToken) => {
    const [result] = await pool.query(
        'INSERT INTO certificates (student_id, qr_token, issued_at) VALUES (?, ?, NOW())',
        [studentId, qrToken]
    );
    return result.insertId;
}

const findByToken = async (token) => {
    const [rows] = await pool.query(
        `SELECT 
            c.id AS certificate_id, c.qr_token, c.issued_at,
            s.id AS student_id, s.fullname, s.email, s.gender,
            g.name AS generation_name, g.start_year, g.end_year,
            sch.name AS scholarship_name,
            CASE sh.name
                WHEN 0 THEN 'Morning'
                WHEN 1 THEN 'Afternoon'
                WHEN 2 THEN 'Evening'
                ELSE 'Unknown'
            END AS shift_name,
            gr.grade, gr.gpa
        FROM certificates c
        JOIN students s ON c.student_id = s.id
        JOIN generations g ON s.generation_id = g.id
        JOIN scholarships sch ON s.scholarship_id = sch.id
        JOIN shifts sh ON s.shift_id = sh.id
        LEFT JOIN grades gr ON s.id = gr.student_id
        WHERE c.qr_token = ? LIMIT 1`,
        [token]
    );
    return rows[0];
};

module.exports = {
    getAllCertificates,
    checkIdExists,
    getCertificateById,
    createCertificate,
    deleteCertificate,


    create,
    findByToken
};  