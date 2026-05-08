const express = require("express");
const router = express.Router();
const scoreController = require("../../controllers/admin/scoreController");

router.post("/", scoreController.createScore);
router.get("/", scoreController.getAllScores);
router.get("/student/:student_id", scoreController.getStudentScores);
router.get("/:id", scoreController.getScoreById);
router.put("/:id", scoreController.updateScore);
router.delete("/:id", scoreController.deleteScore);
// router.get("/class/:class_id", scoreController.getClassScoreForm);

module.exports = router;