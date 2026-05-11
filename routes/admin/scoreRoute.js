const express = require("express");
const router = express.Router();
const scoreController = require("../../controllers/admin/scoreController");
const validate = require('../../middlewares/validate');
const { createScoreSchema, updateScoreSchema } = require('../../validators/score');

router.post("/", validate(createScoreSchema), scoreController.createScore);
router.get("/", scoreController.getAllScores);
router.get("/student/:student_id", scoreController.getStudentScores);
router.get("/subject/:subject_id", scoreController.getSubjectScores);
router.get("/:id", scoreController.getScoreById);
router.put("/:id", validate(updateScoreSchema), scoreController.updateScore);
router.delete("/:id", scoreController.deleteScore);
// router.get("/class/:class_id", scoreController.getClassScoreForm);

module.exports = router;