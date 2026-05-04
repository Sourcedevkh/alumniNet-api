const express = require('express');
const router = express.Router();

const SuperAdminController = require('../../controllers/super-admin/authController');

router.post('/register', SuperAdminController.register);

module.exports = router;