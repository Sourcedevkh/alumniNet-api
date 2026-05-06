const { pool } = require('../../config/db');

const create = async (body) => {
    let arrs = [body.fullname, body.email, body.password, body.verificationToken, body.verificationExpires];
    let [result] = await pool.query("INSERT INTO users (fullname, email, password, verification_token, verification_expires) VALUES (?, ?, ?, ?, ?)", arrs);
    return result.insertId;
}

const findById = async (id) => {
    let [rows] = await pool.query('SELECT id, fullname, email, phone, address, role, is_active, is_verified FROM users WHERE id = ?', [id]);
    return rows;
}

const findByEmail = async (email) => {
    let [rows] = await pool.query('SELECT id, fullname, email, password, phone, address, role, is_active, is_verified FROM users WHERE email = ?', [email]);
    return rows;
}

const updateStatus = async (id, status) => {
    let [result] = await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
} 

const updatePassword = async(id, hashedPassword) => {
    let [result] = await pool.query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashedPassword, id]);
    return result.affectedRows;
}

module.exports = {
    create,
    findByEmail,
    findById,
    updateStatus,
    updatePassword
}
