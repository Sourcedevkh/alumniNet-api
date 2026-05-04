const express = require('express');
const router = express.Router();

const SuperAdminController = require('../../controllers/super-admin/authController');
const validate = require('../../middlewares/validate');
const { createUserSchema, resetPasswordSchema } = require('../../validators/user')

router.post('/register', validate(createUserSchema), SuperAdminController.register);
router.put('/admin-status/:id', SuperAdminController.changeStatus);
router.put('/reset-pwd/:id', validate(resetPasswordSchema), SuperAdminController.resetPassword);

module.exports = router;