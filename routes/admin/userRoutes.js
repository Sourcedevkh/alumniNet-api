const express = require('express');
const router = express.Router();

const AdminController = require('../../controllers/admin/authController');
const validate = require('../../middlewares/validate');
const {loginUserSchema, resetVerificationLinkSchema, emailSchema, verifyOTPSchema, resetPasswordSchema} = require('../../validators/user')
const { isLogin } = require('../../middlewares/auth');

router.post('/login', validate(loginUserSchema), AdminController.login);
router.get('/verify-email', AdminController.verifyEmail);
router.post('/resend-verification-link', validate(resetVerificationLinkSchema), AdminController.resendVerificationLink);
router.delete('/logout', isLogin, AdminController.logout);
router.post('/forgot-password', validate(emailSchema), AdminController.forgotPWD);
router.post('/verify-otp', validate(verifyOTPSchema), AdminController.verifyOTP);
router.post('/reset-password', validate(resetPasswordSchema), AdminController.resetPassword);


module.exports = router;