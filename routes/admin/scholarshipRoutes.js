const express = require('express');
const router = express.Router();

const scholarshipController = require('../../controllers/admin/scholarController');

// Scholarship Type routes
router.post('/scholarship-types', scholarshipController.createScholarshipType);
router.get('/scholarship-types', scholarshipController.getScholarshipTypes);
router.put('/scholarship-types/:id', scholarshipController.updateScholarshipType);
router.delete('/scholarship-types/:id', scholarshipController.deleteScholarshipType);

//Scholarship subject routes
router.post('/scholarship-subjects', scholarshipController.createScholarshipSubject);
router.get('/scholarship-subjects', scholarshipController.getAllScholarshipSubjects);


module.exports = router;