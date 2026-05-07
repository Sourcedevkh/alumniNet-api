const { sendResponse } = require("../../utils/responseHelper");
const studentService = require("../../services/admin/studentService");

const createStudent = async (req, res) => {
  try {
    const [result] = await studentService.createStudent(req);

    return sendResponse(res, 200, true, "Create student succeeded", result[0]);
  } catch (error) {
    
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const updateStudentInfo = async (req, res) => {
  try {
    let body = await req.validateBody;
    const id = req.params.id;
    const [result] = await studentService.updateStudentInfo(id ,body);

    return sendResponse(res, 200, true, "Update student succeeded", result[0]);
  } catch (error) {
    
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await studentService.updateStudentProfile(id , req.file);

    return sendResponse(res, 200, true, "Update student succeeded", result[0]);
  } catch (error) {
    
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    await studentService.deleteStudent(id);

    return sendResponse(res, 200, true, "Student deleted successfully", null);
  } catch (error) {
    console.log(error);
    
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await studentService.getAllStudents();
    return sendResponse(res, 200, true, "Get all students succeeded", result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await studentService.getStudentById(id);
    return sendResponse(res, 200, true, "Get student by ID succeeded", result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

module.exports = {
  createStudent,
  updateStudentInfo,
  updateStudentProfile,
  deleteStudent,
  getAllStudents,
  getStudentById,
};
