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
const { authLimiter } = require('../../dist/middlewares/rateLimiter');

router.use(authLimiter); 

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
router.put('/tracks/:id', isLogin, validate(scholarshipTrackSchema), scholarshipController.updateScholarshipTrack);
router.delete('/tracks/:id', isLogin, validate(scholarshipTrackSchema), scholarshipController.deleteScholarshipTrack);

// Scholarship routes
router.post('/scholarships', isLogin, validate(scholarshipCreateSchema), scholarshipController.createScholarship);
router.get('/scholarships', isLogin, scholarshipController.getAllScholarships);
router.get('/scholarships/:id', isLogin, scholarshipController.getScholarship);
router.put('/scholarships/:id', isLogin, validate(scholarshipUpdateSchema), scholarshipController.updateScholarship);
router.delete('/scholarships/:id', isLogin, validate(scholarshipUpdateSchema), scholarshipController.deleteScholarship);

module.exports = router;