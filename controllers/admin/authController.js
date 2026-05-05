const authService = require('../../services/admin/authService');
const {sendResponse} = require('../../utils/responseHelper');

const login = async (req, res) => {
    try {
        let arrs = req.validateBody;
        const result = await authService.login(arrs);
        return sendResponse(res, 200, true, 'Login successed', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
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
        const userId = req.user.id; 
        
        const userData = await authService.getMe(userId);
        
        return sendResponse(res, 200, true, 'User information', userData);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const resendVerificationLink = async (req, res) =>{
    try {
        let result = await authService.resendVerificationLink(req.validateBody.email);
        return sendResponse(res, 200, true, result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    login,
    getMe,
    verifyEmail,
    resendVerificationLink
};