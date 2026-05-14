const { pool } = require('../../config/db');

const findAttempt = async (userId, deviceId) => {
    const [rows] = await pool.query(
        `SELECT * FROM login_attempts 
         WHERE user_id = ? AND device_id = ?`,
        [userId, deviceId]
    );
    return rows;
};

const createAttempt = async (userId, deviceId) => {
    await pool.query(
        `INSERT INTO login_attempts (user_id, device_id, attempt_count, last_attempt_at) 
         VALUES (?, ?, 1, NOW())`,
        [userId, deviceId]
    );
};

const increaseAttempt = async (userId, deviceId) => {
    await pool.query(
        `UPDATE login_attempts 
         SET attempt_count = attempt_count + 1, last_attempt_at = NOW() 
         WHERE user_id = ? AND device_id = ?`,
        [userId, deviceId]
    );
};

const blockLevel1 = async (userId, deviceId) => {
    await pool.query(
        `UPDATE login_attempts 
         SET blocked_until = NOW() + INTERVAL 5 MINUTE,
             block_level = 1, attempt_count = 0
         WHERE user_id = ? AND device_id = ?`,
        [userId, deviceId]
    );
};

const blockLevel2 = async (userId, deviceId) => {
    await pool.query(
        `UPDATE login_attempts 
         SET blocked_until = NOW() + INTERVAL 10 MINUTE,
             block_level = 2, attempt_count = 0
         WHERE user_id = ? AND device_id = ?`,
        [userId, deviceId]
    );
};

const blockLevel3 = async (userId, deviceId) => {
    await pool.query(
        `UPDATE login_attempts 
         SET blocked_until = NULL,
             block_level = 3, attempt_count = 0
         WHERE user_id = ? AND device_id = ?`,
        [userId, deviceId]
    );
};

const handleFailed = async (userId, deviceId) => {
    const attempt = await findAttempt(userId, deviceId);

    if (attempt.length === 0) {
        await createAttempt(userId, deviceId);
        return;
    }

    const record = attempt[0];
    const blockLevel = record.block_level;
    const count = record.attempt_count;

    // level 3 — permanent, do nothing
    if (blockLevel === 3) return;

    await increaseAttempt(userId, deviceId);

    if (blockLevel === 0 && count + 1 >= 3) {
        await blockLevel1(userId, deviceId);
        return;
    }

    if (blockLevel === 1 && count + 1 >= 1) {
        await blockLevel2(userId, deviceId);
        return;
    }

    if (blockLevel === 2 && count + 1 >= 1) {
        await blockLevel3(userId, deviceId);
        return;
    }
};

const resetAttempt = async (userId, deviceId) => {
    await pool.query(
        `DELETE FROM login_attempts 
         WHERE user_id = ? AND device_id = ?`,
        [userId, deviceId]
    );
};

const unlockAccount = async (userId) => {
    await pool.query(
        `UPDATE login_attempts
         SET blocked_until = NULL, block_level = 0, attempt_count = 0
         WHERE user_id = ?`,
        [userId]
    );
};

const isPermanentlyBlocked = async (email) => {
    const [rows] = await pool.query('SELECT * FROM login_attempts WHERE email = ? AND block_level = 3', [email]);
    return rows.length > 0;
};

module.exports = {
    findAttempt,
    handleFailed,
    resetAttempt,
    unlockAccount,
    isPermanentlyBlocked
};