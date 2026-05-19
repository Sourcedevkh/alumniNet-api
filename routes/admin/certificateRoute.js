const express = require('express');
const router = express.Router();

const certificateController = require('../../controllers/admin/certificateController');
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { certificateSchema } = require('../../validators/certificate');
const { authLimiter } = require('../../middlewares/rateLimiter');

router.use(authLimiter);

router.post('/certificates/generate-qrcode', certificateController.generateAdminQR);

module.exports = router;