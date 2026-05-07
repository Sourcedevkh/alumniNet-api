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
router.put('/scholarship-subjects/:id', scholarshipController.updateScholarshipSubject);
router.delete('/scholarship-subjects/:id', scholarshipController.deleteScholarshipSubject);

// Scholarship Track routes
router.post('/scholarship-tracks', scholarshipController.createScholarshipTrack);
router.get('/scholarship-tracks', scholarshipController.getAllScholarshipTracks);
router.put('/scholarship-tracks/:id', scholarshipController.updateScholarshipTrack);
router.delete('/scholarship-tracks/:id', scholarshipController.deleteScholarshipTrack);

module.exports = router;