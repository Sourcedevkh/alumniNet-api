const express = require("express");
const router = express.Router();

const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const scoreController = require("../../controllers/admin/scoreController");
const {  createScoreSchema, updateScoreSchema} = require('../../validators/score');
// const { authLimiter } = require('../../middlewares/rateLimiter');
//
// router.use(authLimiter);

router.post("/", isLogin, validate(createScoreSchema), scoreController.createScore);
router.get("/", isLogin, scoreController.getAllScores);
router.get("/student/:student_id", isLogin, scoreController.getStudentScores);
router.get("/subject/:subject_id", isLogin, scoreController.getSubjectScores);
router.get("/:id", isLogin, scoreController.getScoreById);
router.put("/batch", isLogin, validate(createScoreSchema), scoreController.updateScoresBatch);
router.delete("/:id", isLogin, scoreController.deleteScore);
// router.get("/class/:class_id", scoreController.getClassScoreForm);

module.exports = router;