const express = require('express');
const router = express.Router();

const AdminController = require('../../controllers/admin/authController');

router.post('/login', AdminController.login);
router.get('/me/:id', AdminController.getMe);
router.get('/verify-email', AdminController.verifyEmail);

module.exports = router;