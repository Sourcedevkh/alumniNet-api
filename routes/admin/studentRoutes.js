/**    Make by SiNeth    **/
const express = require("express");
const router = express.Router();

const { isLogin } = require("../../middlewares/auth");
const { createStudent } = require("../../validators/user");
const handleProfileUpload = require("../../middlewares/handleProfileUpload");
const validate = require("../../middlewares/validate");
const studentController = require("../../controllers/admin/studentController");

router.post(
  "/create",
  handleProfileUpload,
  validate(createStudent),
  studentController.createStudent,
);

router.put(
  "/update-profile/:id",
  handleProfileUpload,
  studentController.updateStudentProfile,
);

router.put(
  "/update-info/:id",
  validate(createStudent),
  studentController.updateStudentInfo,
);

router.delete("/delete/:id", studentController.deleteStudent);
router.get("/all", studentController.getAllStudents);
router.get("/id/:id", studentController.getStudentById);

// Add student to class
router.post("/add-class", studentController.addStudentToClass);
router.delete("/remove/classes/:class_id/students/:student_id", studentController.removeStudentFromClass);
router.get("/by-class/:class_id", studentController.getStudentsByClassId);
router.get("/by-student/:student_id", studentController.getClassesByStudentId);

module.exports = router;
