const authService = require('../../services/super-admin/authService');
const { sendResponse } = require('../../utils/responseHelper');  

const register = async (req, res) => {
    try {
        let arrs = req.validateBody;
        let result = await authService.create(arrs);
        return sendResponse(res, 201, true, 'User created', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = req.body.status;

        if (status != 0 && status != 1) {
            return sendResponse(res, 400, false, 'Status must be 0 (disable) OR 1 (enable)');
        }
        let updateAdmin = await authService.adminStatus(id, status);
        return sendResponse(res, 200, true, 'Admin status updated', updateAdmin);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const forgotPassword = async (req, res) => {
    try {
        const email = req.validateBody.email;
        const result = await authService.requestPasswordReset(email);
        return sendResponse(res, 200, true, result.message);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const verifyAndResetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const newPassword = req.validateBody.newPassword;

        const result = await authService.verifyAndResetPassword(token, newPassword);
        return sendResponse(res, 200, true, result.message);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const unlockAccount = async (req, res) => {
    try {
        const { email } = req.body;
        await authService.unlockAccount(email);
        return sendResponse(res, 200, true, `Account ${email} has been unlocked`);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};


module.exports = {
    register,
    changeStatus,
    unlockAccount,
    forgotPassword,
    verifyAndResetPassword
}