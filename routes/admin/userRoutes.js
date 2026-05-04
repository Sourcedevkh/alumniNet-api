const express = require('express');
const router = express.Router();

const AdminController = require('../../controllers/admin/authController');
const validate = require('../../middlewares/validate');
const {loginUserSchema} = require('../../validators/user')
const { isLogin } = require('../../middlewares/auth');

router.post('/login', validate(loginUserSchema), AdminController.login);
router.get('/me', isLogin, AdminController.getMe);
router.get('/verify-email', AdminController.verifyEmail);

module.exports = router;