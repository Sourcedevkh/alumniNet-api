const Attempt = require('../models/admin/attempt');

const checkBlocked = async (userId, deviceId) => {
    const attempt = await Attempt.findAttempt(userId, deviceId);
    if (attempt.length === 0) return;

    const record = attempt[0];
    if (record.block_level === 3) {
        throw new Error("Your account is permanently blocked. Please contact support.");
    }
    if (record.blocked_until && new Date(record.blocked_until) > new Date()) {
        const minutesLeft = Math.ceil(
            (new Date(record.blocked_until) - new Date()) / 1000 / 60
        );
        throw new Error(`Too many attempts. Try again in ${minutesLeft} minute(s).`);
    }
};

const handleFailed = async (userId, deviceId) => {
    await Attempt.handleFailed(userId, deviceId);
};

const resetAttempt = async (userId, deviceId) => {
    await Attempt.resetAttempt(userId, deviceId);
};

module.exports = { 
    checkBlocked, 
    handleFailed, 
    resetAttempt 
};