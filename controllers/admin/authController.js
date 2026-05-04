const authService = require('../../services/admin/authService');
const {sendResponse} = require('../../utils/responseHelper');

const login = async (req, res) => {
    try {
        const userInfo = await authService.login(req.body);
        sendResponse(res, 200, userInfo);
    } catch (error) {
        sendResponse(res, 400, { error: error.message });
    }
}

const verifyEmail = async (req, res) => {
    try {
        let result = await authService.verifyEmail(req.query.token);
        return sendResponse(res, 200, true, result);
    } catch (error) {
        sendResponse(res, 400, { error: error.message });
    }
}

const getMe = async (req, res) => {
    try {
        let row = await authService.getMe(req.params.id);
        console.log(row);
        
        return sendResponse(res, 200, true, 'User information', row);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    login,
    getMe,
    verifyEmail
};