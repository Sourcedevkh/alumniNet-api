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

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;        
        const updateData = req.validateBody; 

        const updatedProfile = await profileService.updateProfile(userId, updateData);
        
        return sendResponse(res, 200, true, 'Profile updated successed', updatedProfile);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const updateAvatar = async (req, res) => {
    try {
        console.log(req.file);
        
        const userId = req.user.id;
        const result = await profileService.updateAvatar(userId, req.file);

        return sendResponse(res, 200, true, "Avatar updated successed", result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const deleteAvatar = async (req, res) => {
    try {
        let userId = req.user.id;
        await profileService.deleteAvatar(userId);
        return sendResponse(res, 200, true, "Avatar deleted successed");
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    getMe,
    updateProfile,
    updateAvatar,
    deleteAvatar
}