const express = require('express');
const router = express.Router();

const AdminController = require('../../controllers/admin/scholarController');
router.post('/scholarship-types', AdminController.createScholarshipType);
router.get('/scholarship-types', AdminController.getScholarshipTypes);
router.put('/scholarship-types/:id', AdminController.updateScholarshipType);
router.delete('/scholarship-types/:id', AdminController.deleteScholarshipType);


module.exports = router;