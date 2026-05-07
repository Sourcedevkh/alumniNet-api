const express = require("express");
const router = express.Router();

const { isLogin } = require("../../middlewares/auth");
const handleProfileUpload = require('../../middlewares/handleProfileUpload')
const validate = require("../../middlewares/validate");
const { createStudent } = require("../../validators/user");
const studentController = require("../../controllers/admin/studentController");

router.post(
  "/create",
  handleProfileUpload,
  validate(createStudent),
  studentController.createStudent,
);

module.exports = router;
