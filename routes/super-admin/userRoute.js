const express = require('express');
const router = express.Router();

const SuperAdminController = require('../../controllers/super-admin/authController');
const validate = require('../../middlewares/validate');
const { createUserSchema, resetAdminSchema, emailSchema, statusSchema } = require('../../validators/user')
// const { authLimiter } = require('../../middlewares/rateLimiter');
//
// router.use(authLimiter);

router.post('/register', validate(createUserSchema), SuperAdminController.register);
router.put('/admin-status/:id', validate(statusSchema), SuperAdminController.changeStatus);
router.post('/forgot-password', validate(emailSchema), SuperAdminController.forgotPassword);
router.post('/reset-password', validate(resetAdminSchema), SuperAdminController.verifyAndResetPassword);
router.post('/unlock-acc', validate(emailSchema), SuperAdminController.unlockAccount);

module.exports = router;