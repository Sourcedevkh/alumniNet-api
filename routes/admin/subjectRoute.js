const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/admin/subjectController');
const validate = require('../../middlewares/validate');
const { createSubjectSchema, updateSubjectSchema } = require('../../validators/subject');

router.post('/', validate(createSubjectSchema), subjectController.createSubject);
router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.put('/:id', validate(updateSubjectSchema), subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
