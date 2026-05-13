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
  isLogin,
  handleProfileUpload,
  validate(createStudent),
  studentController.createStudent,
);

router.put(
  "/update-profile/:id",
  isLogin,
  handleProfileUpload,
  studentController.updateStudentProfile,
);

router.put(
  "/update-info/:id",
  isLogin,
  validate(createStudent),
  studentController.updateStudentInfo,
);

router.delete("/delete/:id", isLogin, studentController.deleteStudent);
router.get("/all", isLogin, studentController.getAllStudents);
router.get("/id/:id", isLogin, studentController.getStudentById);

// Add student to class
router.post("/add-class", isLogin, studentController.addStudentToClass);
router.delete("/remove/classes/:class_id/students/:student_id", isLogin, studentController.removeStudentFromClass);
router.get("/by-class/:class_id", isLogin, studentController.getStudentsByClassId);
router.get("/by-student/:student_id", isLogin, studentController.getClassesByStudentId);

module.exports = router;
