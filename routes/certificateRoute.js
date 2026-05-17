const express = require('express');
const router = express.Router();

const certificateController = require('../controllers/admin/certificateController');

// Public route - no authentication needed
router.get('/verify', certificateController.handleCertificateScan);

module.exports = router;
