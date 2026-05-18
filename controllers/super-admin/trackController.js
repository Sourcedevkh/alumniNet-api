const { get } = require('../../config/mailler');
const trackService = require('../../services/super-admin/trackService');
const { sendResponse } = require('../../utils/responseHelper');

const getAllUsers = async (req, res) => {
    try {
        const users = await trackService.getAllUsers();
        return sendResponse(res, 200, true, 'Get all users successed', users);
    } catch (error) {
        return sendResponse(res, 400, error.message);
    }
}

const getUserDevice = async (req, res) => {
    try {
        let result = await trackService.getAllUserDevices();
        return sendResponse(res, 200, true, 'Get all user devices successed', result);
    } catch (error) {
        return sendResponse(res, 400, error.message);
    }
}

const getAllLoginAttempts = async (req, res) => {
    try {
        let result = await trackService.getAllLoginAttempts();
        return sendResponse(res, 200, true, 'Get all login attempts successed', result);
    } catch (error) {
        return sendResponse(res, 400, error.message);
    }
}

const getAllUserlogAttempts = async (req, res) => {
    try {
        let result = await trackService.getAllUserloginAttempts();
        return sendResponse(res, 200, true, 'Get all user login attempts successed', result);
    } catch (error) {
        return sendResponse(res, 400, error.message);
    }
}

module.exports = {
    getAllUsers,
    getUserDevice,
    getAllLoginAttempts,
    getAllUserlogAttempts   
}