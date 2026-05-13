const Attempt = require("../models/admin/attempt");

const checkBlocked = async (email, ip, deviceId) => {
    const attempt = await Attempt.findAttempt(email, ip, deviceId);
    if (
        attempt.length > 0 &&
        attempt[0].blocked_until &&
        new Date(attempt[0].blocked_until) > new Date()
    ) {
        throw new Error("Too many login attempts. Try again later.");
    }
};
const handleFailed = async (email, ip, deviceId) => {
    await Attempt.handleFailed(email, ip, deviceId);
};

const resetAttempt = async (email, ip, deviceId) => {
    await Attempt.resetAttempt(email, ip, deviceId);
};

module.exports = { checkBlocked, handleFailed, resetAttempt };