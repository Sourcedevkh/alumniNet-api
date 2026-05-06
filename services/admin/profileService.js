const User = require('../../models/admin/user');

const getProfile = async (id) => {
    let data = await User.findById(id);
    if(data.length === 0){
        throw new Error('User not found');
    }
    
    return data[0];
}

const updateProfile = async (id, body) => {
    let 
}

module.exports = {
    getProfile
}
