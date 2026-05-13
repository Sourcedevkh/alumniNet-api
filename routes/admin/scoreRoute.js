const express = require("express");
const router = express.Router();
const scoreController = require("../../controllers/admin/scoreController");
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { createScoreSchema, updateScoreSchema } = require('../../validators/score');

router.post("/", isLogin, validate(createScoreSchema), scoreController.createScore);
router.get("/", isLogin, scoreController.getAllScores);
router.get("/student/:student_id", isLogin, scoreController.getStudentScores);
router.get("/subject/:subject_id", isLogin, scoreController.getSubjectScores);
router.get("/:id", isLogin, scoreController.getScoreById);
router.put("/:id", isLogin, validate(updateScoreSchema), scoreController.updateScore);
router.delete("/:id", isLogin, scoreController.deleteScore);
// router.get("/class/:class_id", scoreController.getClassScoreForm);

module.exports = router;