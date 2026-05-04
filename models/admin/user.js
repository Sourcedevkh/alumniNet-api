const pool = require('../../config/db');

const findByEmail = async (email) => {
    let [rows] = await pool.query('SELECT id, email, password, phone, address, role, is_active, is_verified FROM users WHERE email = ?', [email]);
    return rows;
}

const findById = async (id) => {
    let [rows] = await pool.query('SELECT id, name, email, phone, address, role, is_active, is_verified FROM users WHERE id = ?', [id]);
    return rows;
}

const findByVerificationEmail = async (token) => {
    let [rows] = await pool.query('SELECT id, name, email, phone, address, role, is_active, token, is_verified, verification_token, verification_expires FROM users WHERE verification_token = ?', [token]);
    return rows;
}

const verifyEmail = async (id) =>{
    await pool.query('UPDATE users SET is_verified = 1 WHERE id = ?', [id]);
}

module.exports = {
    findByEmail,
    findById,
    findByVerificationEmail,
    verifyEmail,
}
