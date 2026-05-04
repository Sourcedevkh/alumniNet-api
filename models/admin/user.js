const pool = require('../../config/db');

const findByEmail = async (email) => {
    let [rows] = await pool.query('SELECT id, email, password, phone, address, role, is_active, is_verified FROM users WHERE email = ?', [email]);
    return rows;
}

const findById = async (id) => {
    // do not select the token field when returning user profile
    let [rows] = await pool.query('SELECT id, name, email, phone, address, role, is_active, is_verified FROM users WHERE id = ?', [id]);
    return rows;
}

const findByVerificationEmail = async (token) => {
    let [rows] = await pool.query('SELECT id, name, email, phone, address, role, is_active, token, is_verified, verification_token, verification_expires FROM users WHERE verification_token = ?', [token]);
    return rows;
}

const getToken = async (token) => {
    let [row] = await pool.query('SELECT token FROM users WHERE token = ?', [token]);
    return row;
}

const verifyEmail = async (id) =>{
    await pool.query('UPDATE users SET is_verified = 1 WHERE id = ?', [id]);
}

const addToken = async (token, id) => {
    const [result] = await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, id]);
    return result;
}

module.exports = {
    findByEmail,
    findById,
    findByVerificationEmail,
    verifyEmail,
    getToken,
    addToken
}
