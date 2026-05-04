const authService = require('../../services/super-admin/authService');
const {sendResponse} = require('../../utils/responseHelper');

const register = async(req, res) =>{
    try {
        let arrs = await authService.create(req.body);
        return sendResponse(res, 201, true, 'User created', arrs);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    register
}