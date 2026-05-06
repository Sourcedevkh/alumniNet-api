const profileService = require('../../services/admin/profileService');
const {sendResponse} = require('../../utils/responseHelper');

const getMe = async (req, res) => {
    try {
        const userId = req.user.id; 
        const userData = await profileService.getProfile(userId);
        
        return sendResponse(res, 200, true, 'User information', userData);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    getMe
}