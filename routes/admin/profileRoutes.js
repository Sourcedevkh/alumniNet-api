const express = require('express');
const router = express.Router();

const {isLogin} = require('../../middlewares/auth')
const validate = require('../../middlewares/validate');
const { updateProfileSchema } = require('../../validators/profile');
const profileController = require('../../controllers/admin/profileController');
const uploadImage = require('../../middlewares/uploadImg');

router.get('/me', isLogin, profileController.getMe);
router.put('/update', isLogin, validate(updateProfileSchema), profileController.updateProfile);
router.put('/update-avatar', isLogin, uploadImage.single('avatar'), profileController.updateAvatar);
router.delete('/delete-avatar', isLogin, profileController.deleteAvatar);

module.exports = router;