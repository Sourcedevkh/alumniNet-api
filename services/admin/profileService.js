const Profile = require('../../models/admin/profile');
const cloudinary = require('../../config/cloudinary')

const getProfile = async (id) => {
    let data = await Profile.findById(id);
    if(data.length === 0){
        throw new Error('User not found');
    }
    
    return data[0];
}

const updateProfile = async (userId, updateData) => {
    const isUpdated = await Profile.updateProfile(userId, updateData);
    if(!isUpdated){
        throw new Error('Profile update failed');
    }

    const updatedUser = await Profile.findById(userId);
    return updatedUser[0];
}

const updateAvatar = async (userId, avatarUrl) => {
    let userRow = await Profile.findById(userId);
    const user = userRow[0];
    if(!user) throw new Error('User not found');

    const profile_url = avatarUrl.path
    const cloudinary_id = avatarUrl.filename
    const updatedAt = new Date();

    const success = await Profile.updateAvatar(userId, profile_url, cloudinary_id);
    if(!success) throw new Error('Failed to update database record');
    return { 
        profile_url, 
        cloudinary_id, 
        updated_at: updatedAt 
    };
}

const deleteAvatar = async (userId) => {
    let userRow = await Profile.findById(userId);
    let user = userRow[0];
    if(!user) throw new Error('User not found');

    const cloudId = user.cloudinary_id;
    if (cloudId) {
        try {
            await cloudinary.uploader.destroy(cloudId);
        } catch (error) {
            console.error('Cloudinary destroy failed:', error.message);
        }
    }
    const success = await Profile.deleteAvatar(userId);
    if(!success) throw new Error('Failed to update user profile in database'); 
    return true;
}

module.exports = {
    getProfile,
    updateProfile,
    updateAvatar,
    deleteAvatar
}
