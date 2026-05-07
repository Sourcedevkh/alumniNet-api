const express = require("express");
const router = express.Router();

const { isLogin } = require("../../middlewares/auth");
const handleProfileUpload = require("../../middlewares/handleProfileUpload");
const validate = require("../../middlewares/validate");
const { createStudent } = require("../../validators/user");
const studentController = require("../../controllers/admin/studentController");

router.post(
  "/create",
  handleProfileUpload,
  validate(createStudent),
  studentController.createStudent,
);

router.post(
  "/update-profile/:id",
  handleProfileUpload,
  studentController.updateStudentProfile,
);

router.post(
  "/update-info/:id",
  validate(createStudent),
  studentController.updateStudentInfo,
);

router.delete("/delete/:id", studentController.deleteStudent);

router.get("/all", studentController.getAllStudents);
router.get("/id/:id", studentController.getStudentById);

module.exports = router;
