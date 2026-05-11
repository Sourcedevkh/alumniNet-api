const express = require('express');
const router = express.Router();

const { isLogin } = require('../../middlewares/auth');
const scholarshipController = require('../../controllers/admin/scholarController');
const validate = require('../../middlewares/validate');
const {
  scholarshipTypeSchema,
  scholarshipSubjectSchema,
  scholarshipTrackSchema,
  scholarshipCreateSchema,
  scholarshipUpdateSchema,
} = require('../../validators/scholarship');

// Scholarship Type routes
router.post('/types', isLogin, validate(scholarshipTypeSchema), scholarshipController.createScholarshipType);
router.get('/types', isLogin, scholarshipController.getScholarshipTypes);
router.put('/types/:id', isLogin, validate(scholarshipTypeSchema), scholarshipController.updateScholarshipType);
router.delete('/types/:id', isLogin, validate(scholarshipTypeSchema), scholarshipController.deleteScholarshipType);

//Scholarship subject routes
router.post('/subjects', isLogin, validate(scholarshipSubjectSchema), scholarshipController.createScholarshipSubject);
router.get('/subjects', isLogin, scholarshipController.getAllScholarshipSubjects);
router.put('/subjects/:id', isLogin, validate(scholarshipSubjectSchema), scholarshipController.updateScholarshipSubject);
router.delete('/subjects/:id', isLogin, validate(scholarshipSubjectSchema), scholarshipController.deleteScholarshipSubject);

// Scholarship Track routes
router.post('/tracks', isLogin, validate(scholarshipTrackSchema), scholarshipController.createScholarshipTrack);
router.get('/tracks', isLogin, scholarshipController.getAllScholarshipTracks);
router.put('/tracks/:id', validate(scholarshipTrackSchema), scholarshipController.updateScholarshipTrack);
router.delete('/tracks/:id', scholarshipController.deleteScholarshipTrack);

// Scholarship routes
router.post('/scholarships', validate(scholarshipCreateSchema), scholarshipController.createScholarship);
router.get('/scholarships', scholarshipController.getAllScholarships);
router.get('/scholarships/:id', scholarshipController.getScholarship);
router.put('/scholarships/:id', validate(scholarshipUpdateSchema), scholarshipController.updateScholarship);
router.delete('/scholarships/:id', scholarshipController.deleteScholarship);

module.exports = router;