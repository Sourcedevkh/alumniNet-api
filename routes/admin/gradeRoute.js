const express = require('express');
const router = express.Router();

const { isLogin } = require('../../middlewares/auth');

const gradeController = require('../../controllers/admin/gradeController');
const validate = require('../../middlewares/validate');
const { gradeSchema } = require('../../validators/grade');
const { authLimiter } = require('../../middlewares/rateLimiter');

router.use(authLimiter); 

router.post('/grades', isLogin, validate(gradeSchema), gradeController.createGrade);
router.get('/grades', isLogin, gradeController.getAllGrades);
router.put('/grades/:id', isLogin, validate(gradeSchema), gradeController.updateGrade);
router.delete('/grades/:id', isLogin, gradeController.deleteGrade);
router.get('/grades/:id', isLogin, gradeController.getGradeById);



module.exports = router;