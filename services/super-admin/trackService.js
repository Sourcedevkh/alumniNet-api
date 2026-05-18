const User = require('../../models/admin/user');
const Device = require('../../models/admin/devices');
const Attempt = require('../../models/admin/attempt');
const UserLogAttempt = require('../../models/admin/userLoginLog');

const getAllUsers = async () => {
    const users = await User.userLog();
    if(users.length === 0) {
        throw new Error('No users found');
    }
    return users;
}

const retrieveUserDevices = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    const devices = await Device.getUserDevices(userId);
    if (devices.length === 0) {
        throw new Error('No devices found for this user');
    }
    return devices;
}

const getAllUserDevices = async () => {
    const devices = await Device.getAllUserDevices();
    if (devices.length === 0) {
        throw new Error('No devices found');
    }
    return devices;
}

const getAllLoginAttempts = async () => {
    const attempts = await Attempt.getAllAttempts();
    if (attempts.length === 0) {
        throw new Error('No login attempts found');
    }
    return attempts;
}

const getAllUserloginAttempts = async () => {
    const attempts = await UserLogAttempt.getAllUserLoginAttempts();
    if (attempts.length === 0) {
        throw new Error('No user login attempts found');
    }
    return attempts;
}

module.exports = {
    getAllUsers,
    retrieveUserDevices,
    getAllUserDevices,
    getAllLoginAttempts,
    getAllUserloginAttempts
}