const authService = require('../../services/admin/authService');
const {sendResponse} = require('../../utils/responseHelper');

const login = async (req, res) => {
    try {
        let arrs = req.validateBody;
        const result = await authService.login(arrs);
        return sendResponse(res, 200, true, 'Login succeeded', result);
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

const logout = async (req, res) => {
    try {
        let userId = req.user.id;
        await authService.logout(userId);
        return sendResponse(res, 200, true, 'Logout succeeded');
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const forgotPWD = async (req, res) => {
    try {
        let email = req.validateBody.email;
        await authService.requestOTP(email);
        return sendResponse(res, 200, true, 'OTP sent to your email, Please check your inbox');
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const verifyOTP = async (req, res) => {
    try {
        let {email, code} = req.validateBody;
        const reset_Token = await authService.verifyOTP(email, code);
        return sendResponse(res, 200, true, 'OTP verified successed', { reset_Token });
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body; 
        await authService.resetPWD(token, password); 

        return sendResponse(res, 200, true, 'Password reset successed');
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}


module.exports = {
    login,
    getMe,
    verifyEmail,
    resendVerificationLink,
    logout,
    forgotPWD,
    verifyOTP,
    resetPassword
};