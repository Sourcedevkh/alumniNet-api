const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/admin/subjectController');
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {createSubjectSchema, updateSubjectSchema} = require('../../validators/subject');
const { authLimiter } = require('../../middlewares/rateLimiter');

router.use(authLimiter); 

router.post('/',isLogin, validate(createSubjectSchema), subjectController.createSubject);
router.get('/', isLogin, subjectController.getAllSubjects);
router.get('/:id', isLogin, subjectController.getSubjectById);
router.put('/:id', isLogin, validate(updateSubjectSchema), subjectController.updateSubject);
router.delete('/:id', isLogin, subjectController.deleteSubject);

module.exports = router;
