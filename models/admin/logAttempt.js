const { pool } = require('../../config/db');

const findByIp = async (ip) => {
    const [rows] = await pool.query(
        `SELECT * FROM ip_attempts WHERE ip_address = ?`,
        [ip]
    );
    return rows;
};

const create = async (ip) => {
    await pool.query(
        `INSERT INTO ip_attempts (ip_address, attempt_count, last_attempt_at)
         VALUES (?, 1, NOW())
         ON DUPLICATE KEY UPDATE
         attempt_count = attempt_count + 1,
         last_attempt_at = NOW()`,
        [ip]
    );
};

const blockIp = async (ip) => {
    await pool.query(
        `UPDATE ip_attempts
         SET blocked_until = NOW() + INTERVAL 15 MINUTE
         WHERE ip_address = ?`,
        [ip]
    );
};

const remove = async (ip) => {
    await pool.query(
        `DELETE FROM ip_attempts WHERE ip_address = ?`,
        [ip]
    );
};

module.exports = { findByIp, create, blockIp, remove };