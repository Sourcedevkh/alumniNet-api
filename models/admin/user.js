const pool = require('../../config/db');

const findByEmail = async (email) => {
    let [rows] = await pool.query('SELECT id, name, email, password, phone, address, role, is_active, is_verified, otp_code, otp_expires_at FROM users WHERE email = ?', [email]);
    return rows;
}

const findById = async (id) => {
    let [rows] = await pool.query('SELECT id, name, email, phone, address, role, is_active, is_verified, updated_at FROM users WHERE id = ?',[id]);
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

const verifyEmail = async (id) => {
    await pool.query('UPDATE users SET is_verified = 1 WHERE id = ?', [id]);
}

const addToken = async (token, id) => {
    const [result] = await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, id]);
    return result;
}

const resendVerificationLink = async (body) => {
    let arrs = [body.verification_token, body.verification_expires, body.id];
    await pool.query('UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?', arrs);
}

const removeToken = async (id) => {
    await pool.query('UPDATE users SET token = NULL WHERE id = ?', [id]);
}


const saveOTP = async (email, code, expiresAt) => {
    let arrs = [code, expiresAt, email];
    return await pool.query('UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?', arrs);
}

const findByOTP = async (email, code) => {
    const [rows] = await pool.query('SELECT id, is_verified FROM users WHERE email = ? AND otp_code = ? AND otp_expires_at > NOW()', [email, code]);
    return rows;
}

const updatePassword = async (id, hashedPassword) => {
    return await pool.query('UPDATE users SET password = ?, otp_code = NULL, otp_expires_at = NULL, updated_at = NOW() WHERE id = ?', [hashedPassword, id]);
}

const clearOTP = async (userId) => {
    return await pool.query('UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE id = ?', [userId]);
};

const updateLoginTime = async (id) => {
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [id]);
};


module.exports = {
    findByEmail,
    findById,
    findByVerificationEmail,
    verifyEmail,
    getToken,
    addToken,
    resendVerificationLink,
    removeToken,
    saveOTP,
    findByOTP,
    updatePassword,
    clearOTP,
    updateLoginTime
}
