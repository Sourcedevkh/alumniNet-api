const logAttempt = require('../../models/admin/logAttempt');

const MAX_ATTEMPTS = 3;

const trackFailedAttempt = async (ip) => {
    await logAttempt.create(ip); 

    const rows = await logAttempt.findByIp(ip);
    const count = rows.length > 0 ? rows[0].attempt_count : 1;

    if (count >= MAX_ATTEMPTS) {
        await logAttempt.blockIp(ip);
    }
};

const resetAttempt = async (ip) => {
    await logAttempt.remove(ip);
};

const isBlocked = async (ip) => {
    const rows = await logAttempt.findByIp(ip);
    if (rows.length === 0) return false;

    const record = rows[0];
    if (record.blocked_until && new Date(record.blocked_until) > new Date()) {
        return true;
    }
    return false;
};

module.exports = { trackFailedAttempt, isBlocked, resetAttempt };