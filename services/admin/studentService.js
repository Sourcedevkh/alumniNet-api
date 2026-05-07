const studentModel = require("../../models/admin/student");
const cloudinary = require("../../config/cloudinary");

const createStudent = async (req) => {
  let body = await req.validateBody;
  let imageUrl = null;
  let cloudinaryId = null;
  const { phone, generation_id, scholarship_id, class_id, shift_id } = body;
  const file = req.file;

  if (file) {
    imageUrl = file.path;
    cloudinaryId = file.filename;
  }

  const [checkPhone] = await studentModel.checkPhone(phone);
  if (checkPhone.length > 0) {
    const error = new Error("Invalid input value");
    error.statusCode = 409;
    error.data = {
      message: "Phone is exist",
    };
    throw error;
  }

  const [genData, classData, shiftData, scholarData] = await Promise.all([
    studentModel.findById(generation_id, "generations"),
    studentModel.findById(class_id, "classes"),
    studentModel.findById(shift_id, "shifts"),
    studentModel.findById(scholarship_id, "scholarships"),
  ]);

  const errors = [];

  if (!genData) errors.push("Invalid Generation ID");
  if (!classData) errors.push("Invalid Class ID");
  if (!shiftData) errors.push("Invalid Shift ID");
  if (!scholarData) errors.push("Invalid Scholarship ID");

  if (errors.length > 0) {
    const error = new Error("Invalid input value");
    error.statusCode = 409;
    error.data = { message: errors };
    // message: errors.join(" | "),
    throw error;
  }

  const insertId = await studentModel.insertStudent(
    body,
    imageUrl,
    cloudinaryId,
  );
  const row = await studentModel.getById(insertId);

  return row;
};

const updateStudentInfo = async (id, body) => {
  const { phone, generation_id, scholarship_id, class_id, shift_id } = body;

  const [existingStudent] = await studentModel.getById(id);
  if (existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  if (phone && phone !== existingStudent[0].phone) {
    const phoneExists = await studentModel.checkPhone(phone);
    if (phoneExists) {
      const error = new Error(
        "Duplicate phone number detected during student update.",
      );
      error.statusCode = 409;
      error.data = {
        message: "Phone number is already in use by another student.",
      };
      throw error;
    }
  }

  const [genData, classData, shiftData, scholarData] = await Promise.all([
    studentModel.findById(generation_id, "generations"),
    studentModel.findById(class_id, "classes"),
    studentModel.findById(shift_id, "shifts"),
    studentModel.findById(scholarship_id, "scholarships"),
  ]);

  const errors = [];

  if (!genData) errors.push("Invalid Generation ID");
  if (!classData) errors.push("Invalid Class ID");
  if (!shiftData) errors.push("Invalid Shift ID");
  if (!scholarData) errors.push("Invalid Scholarship ID");

  if (errors.length > 0) {
    const error = new Error("Invalid input value");
    error.statusCode = 409;
    error.data = { message: errors };
    throw error;
  }

  await studentModel.updateStudentInfo(id, body);
  const updatedStudent = await studentModel.getById(id);

  return updatedStudent;
};

const updateStudentProfile = async (id, file) => {
  const existingStudent = await studentModel.getById(id);
  if (existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  let imageUrl = null;
  let cloudinaryId = null;
  if (file) {
    imageUrl = file.path;
    cloudinaryId = file.filename;
  }
  await studentModel.updateStudentProfile(id, imageUrl, cloudinaryId);
  const updatedStudent = await studentModel.getById(id);

  return updatedStudent;
};

const deleteStudent = async (id) => {
  const [existingStudent] = await studentModel.getById(id);
  if (existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  if (existingStudent[0].cloudinary_id) {
    await cloudinary.uploader.destroy(existingStudent[0].cloudinary_id);
  }

  await studentModel.deleteStudent(id);
};

const getAllStudents = async () => {
  const students = await studentModel.getAllStudents();
  return students;
};

const getStudentById = async (id) => {
  const [existingStudent] = await studentModel.getById(id);
  if (existingStudent.length === 0) {
    const error = new Error("Student record does not exist.");
    error.statusCode = 404;
    error.data = {
      message: "Student not found.",
    };
    throw error;
  }

  return existingStudent[0];
};

module.exports = {
  createStudent,
  updateStudentInfo,
  updateStudentProfile,
  deleteStudent,
  getAllStudents,
  getStudentById,
};
