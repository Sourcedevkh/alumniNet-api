const express = require('express');
const router = express.Router();

const {isLogin} = require('../../middlewares/auth')
const profileController = require('../../controllers/admin/profileController');

router.get('/me', isLogin, profileController.getMe);

module.exports = router;