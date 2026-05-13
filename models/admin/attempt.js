const { pool } = require('../../config/db');

const findAttempt = async (email, ip, deviceId) => {
    const [rows] = await pool.query(
        `SELECT * FROM login_attempts 
         WHERE email = ? AND ip_address = ? AND device_id = ?`,
        [email, ip, deviceId]
    );
    return rows;
};

const createAttempt = async (email, ip, deviceId) => {
    const [result] = await pool.query(
        `INSERT INTO login_attempts (email, ip_address, device_id, attempt_count, last_attempt_at) 
         VALUES (?, ?, ?, 1, NOW())`,
        [email, ip, deviceId]
    );
    return result;
};

const increaseAttempt = async (email, ip, deviceId) => {
    const [result] = await pool.query(
        `UPDATE login_attempts 
         SET attempt_count = attempt_count + 1, last_attempt_at = NOW() 
         WHERE email = ? AND ip_address = ? AND device_id = ?`,
        [email, ip, deviceId]
    );
    return result;
};

const blockLevel1 = async (email, ip, deviceId) => {
    await pool.query(
        `UPDATE login_attempts 
         SET blocked_until = NOW() + INTERVAL 1 MINUTE,
             block_level = 1,
             attempt_count = 0
         WHERE email = ? AND ip_address = ? AND device_id = ?`,
        [email, ip, deviceId]
    );
};

const blockLevel2 = async (email, ip, deviceId) => {
    await pool.query(
        `UPDATE login_attempts
        SET blocked_until = NOW() + INTERVAL 3 MINUTE,
            block_level = 2,
            attempt_count = 0
        WHERE email = ? AND ip_address = ? AND device_id = ?`,
        [email, ip, deviceId]
    )
}

const blockLevel3 = async (email, ip, deviceId) => {
    await pool.query(
        `UPDATE login_attempts
        SET blocked_until = NULL,
            block_level = 3,
            attempt_count = 0
        WHERE email = ? AND ip_address = ? AND device_id = ?`,
        [email, ip, deviceId]
    )
}

// const blockDevice = async (email, ip, deviceId) => {
//     const [result] = await pool.query(
//         `UPDATE login_attempts 
//          SET blocked_until = NOW() + INTERVAL 15 MINUTE
//          WHERE email = ? AND ip_address = ? AND device_id = ?
//          AND attempt_count >= 3`,
//         [email, ip, deviceId]
//     );
//     return result;
// };

// const handleFailed = async (email, ip, deviceId) => {
//     const attempt = await findAttempt(email, ip, deviceId);

//     if (attempt.length > 0) {
//         await increaseAttempt(email, ip, deviceId);
//     } else {
//         await createAttempt(email, ip, deviceId);
//     }

//     await blockDevice(email, ip, deviceId);
// };

const handleFailed = async (email, ip, deviceId) => {
    const attempt = await findAttempt(email, ip, deviceId);
    if(attempt.length === 0){
        await createAttempt(email, ip, deviceId);
        return;
    }

    const record = attempt[0];
    const blockLevel = record.block_level;
    const count = record.attempt_count;

    await increaseAttempt(email, ip, deviceId);

    // if wrong 3 times, blocked 5 minutes
    if(blockLevel === 0 && count + 1 >= 3){
        await blockLevel1(email, ip, deviceId);
        return;
    }

    // blocked 5m
    if(blockLevel === 1 && count + 1 >=1){
        await blockLevel2(email, ip, deviceId);
        return;
    }

    // blocked 15m
    if(blockLevel === 2 && count + 1 >= 1){
        await blockLevel3(email, ip, deviceId);

        // locked ip permanently
        await lockIP(ip);
        return;
    }
}

const lockIP = async (ip) => {
    await pool.query(
        `INSERT INTO ip_attempts (ip_address, attempt_count, blocked_until, last_attempt_at)
         VALUES (?, 1, '9999-12-31 23:59:59', NOW())
         ON DUPLICATE KEY UPDATE
         blocked_until = '9999-12-31 23:59:59',
         last_attempt_at = NOW()`,
        [ip]
    );
}

const resetAttempt = async (email, ip, deviceId) => {
    const [result] = await pool.query(
        `DELETE FROM login_attempts 
         WHERE email = ? AND ip_address = ? AND device_id = ?`,
        [email, ip, deviceId]
    );
    return result;
};

const unlockAccount = async (email) => {
    await pool.query(
        `UPDATE login_attempts
         SET blocked_until = NULL,
             block_level = 0,
             attempt_count = 0
         WHERE email = ?`,
        [email]
    );

    // also unblock IP
    await pool.query(
        `UPDATE ip_attempts
         SET blocked_until = NULL
         WHERE ip_address IN (
             SELECT ip_address FROM login_attempts WHERE email = ?
         )`,
        [email]
    );
};

// const unlockAccount = async (email) => {
//     await pool.query(
//          `SELECT * FROM login_attempts WHERE email = ? AND block_level = 3`,
//         [email]
//     )
// }

module.exports = {
    findAttempt,
    handleFailed,
    resetAttempt,
    unlockAccount,
    // unlockAccount
};