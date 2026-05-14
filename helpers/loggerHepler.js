const Log = require("../models/admin/userLoginLog"); 

const logAttempt = async (userId, ip, userAgent, success) => {
    await Log.createAttempt(userId, ip, userAgent, success ? 1 : 0);
};

module.exports = { logAttempt };