const express = require('express');
const router = express.Router();

const TrackController = require('../../controllers/super-admin/trackController');
// const { authLimiter } = require('../../middlewares/rateLimiter');
//
// router.use(authLimiter);

router.get('/getAllUsers', TrackController.getAllUsers);
router.get('/getUserDevice', TrackController.getUserDevice);
router.get('/getAllLoginAttempts', TrackController.getAllLoginAttempts);
router.get('/getAllUserLoginAttempts', TrackController.getAllUserlogAttempts);

module.exports = router;