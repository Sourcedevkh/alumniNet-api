const express = require('express');
const router = express.Router();

const scholarshipController = require('../../controllers/admin/scholarController');
const validate = require('../../middlewares/validate');
const { scholarshipTypeSchema, scholarshipSubjectSchema,scholarshipTrackSchema} = require('../../validators/scholarship');

// Scholarship Type routes
router.post('/types', validate(scholarshipTypeSchema), scholarshipController.createScholarshipType);
router.get('/types', scholarshipController.getScholarshipTypes);
router.put('/types/:id',validate(scholarshipTypeSchema), scholarshipController.updateScholarshipType);
router.delete('/types/:id', scholarshipController.deleteScholarshipType);

//Scholarship subject routes
router.post('/subjects',validate(scholarshipSubjectSchema), scholarshipController.createScholarshipSubject);
router.get('/subjects', scholarshipController.getAllScholarshipSubjects);
router.put('/subjects/:id', validate(scholarshipSubjectSchema), scholarshipController.updateScholarshipSubject);
router.delete('/subjects/:id', scholarshipController.deleteScholarshipSubject);

// Scholarship Track routes
router.post('/tracks', validate(scholarshipTrackSchema), scholarshipController.createScholarshipTrack);
router.get('/tracks', scholarshipController.getAllScholarshipTracks);
router.put('/tracks/:id', validate(scholarshipTrackSchema), scholarshipController.updateScholarshipTrack);
router.delete('/tracks/:id', scholarshipController.deleteScholarshipTrack);

module.exports = router;