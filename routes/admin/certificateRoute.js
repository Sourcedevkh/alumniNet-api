const express = require('express');
const router = express.Router();

const certificateController = require('../../controllers/admin/certificateController');
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { certificateSchema } = require('../../validators/certificate');

router.post('/certificates', isLogin, validate(certificateSchema), certificateController.createCertificate);
router.get('/certificates', isLogin, certificateController.getAllCertificates);
router.delete('/certificates/:id', isLogin, validate(certificateSchema), certificateController.deleteCertificate);
router.get('/certificates/:id', isLogin, validate(certificateSchema), certificateController.getCertificateById);

module.exports = router;