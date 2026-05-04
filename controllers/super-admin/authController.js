const authService = require('../../services/super-admin/authService');
const {sendResponse} = require('../../utils/responseHelper');

const register = async(req, res) =>{
    try {
        let arrs = req.validateBody;
        let result = await authService.create(arrs);
        return sendResponse(res, 201, true, 'User created', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const changeStatus = async(req, res) =>{
    try {
        const {id} = req.params;
        const status = req.body.status;

        if(status != 0 && status != 1){
            return sendResponse(res, 400, false, 'Status must be 0 (disable) OR 1 (enable)');
        }
        let updateAdmin = await authService.adminStatus(id, status);
        return sendResponse(res, 200, true, 'Admin status updated', updateAdmin);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    register,
    changeStatus
}