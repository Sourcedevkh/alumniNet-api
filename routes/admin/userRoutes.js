const express = require('express');
const router = express.Router();

const AdminController = require('../../controllers/admin/authController');
const validate = require('../../middlewares/validate');
const {loginUserSchema, resetVerificationLinkSchema} = require('../../validators/user')
const { isLogin } = require('../../middlewares/auth');

router.post('/login', validate(loginUserSchema), AdminController.login);
router.get('/me', isLogin, AdminController.getMe);
router.get('/verify-email', AdminController.verifyEmail);
router.post('/resend-verification-link', validate(resetVerificationLinkSchema), AdminController.resendVerificationLink);
router.post('/resend-verification-link', validate(resetVerificationLinkSchema), AdminController.resendVerificationLink);
router.delete('/logout', isLogin, AdminController.logout);

module.exports = router;