const { pool } = require('../../config/db');

const createAttempt = async (userId, ip, userAgent, success) => {
    await pool.query(
        `INSERT INTO user_login_logs (user_id, ip_address, user_agent, success, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [userId, ip, userAgent, success]
    );
};

module.exports = { createAttempt };