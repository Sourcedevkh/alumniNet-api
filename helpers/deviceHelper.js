const User = require("../models/admin/user");
const Device = require("../models/admin/devices");
const {getDeviceInfo} = require('./requestHelper');

const updateUserOnLogin = async (userId, ip) => {
    await User.updateLoginTime(userId);
    await User.updateLastIP(userId, ip);
};

const trackDevice = async ({ userId, deviceId, userAgent, ip }) => {
     const { browser_name, device_name } = getDeviceInfo(userAgent);
    await Device.upsertDevice({
        user_id: userId,
        device_id: deviceId,
        user_agent: userAgent,
        ip,
        browser_name,
        device_name
    });
};

module.exports = { updateUserOnLogin, trackDevice };