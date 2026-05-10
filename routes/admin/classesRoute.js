const express = require('express');
const router = express.Router();

const ClassesController = require('../../controllers/admin/classesController');
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { classSchema, statusSchema } = require('../../validators/classes');

router.post('/create', isLogin, validate(classSchema), ClassesController.createClasses);
router.get('/getAll', isLogin, ClassesController.getAll);
router.get('/getClass/:id', isLogin, ClassesController.getClassbyId);
router.get('/:id', isLogin, ClassesController.findById);
router.put('/update/:id', isLogin, validate(classSchema), ClassesController.updateClass);
router.put('/archive/:id', isLogin, validate(statusSchema), ClassesController.archiveClass);

module.exports = router;