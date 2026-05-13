const { sendResponse } = require("../../utils/responseHelper");
const studentService = require("../../services/admin/studentService");

const createStudent = async (req, res) => {
  try {
    let body = await req.validateBody;
    const result = await studentService.createStudent(body, req.file);
    
    return sendResponse(res, 200, true, "Create student succeeded", result);
  } catch (error) {
    
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const updateStudentInfo = async (req, res) => {
  try {
    let body = await req.validateBody;
    const id = req.params.id;
    const result = await studentService.updateStudentInfo(id ,body);

    return sendResponse(res, 200, true, "Update student info succeeded", result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await studentService.updateStudentProfile(id , req.file);

    return sendResponse(res, 200, true, "Update student profile succeeded", result);
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
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await studentService.getAllStudents(req.query);
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

// Add student to class
const addStudentToClass = async (req, res) => {
  try {
    const result = await studentService.addStudentToClass(req.body);
    return sendResponse(res, 200, true, "Student added successfully", result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const removeStudentFromClass = async (req, res) => {
  try {
    const classId = req.params.class_id;
    const studentId = req.params.student_id;
    await studentService.removeStudentFromClass(classId, studentId);
    return sendResponse(res, 200, true, "Student removed from class successfully", null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const getStudentsByClassId = async (req, res) => {
  try {
    const classId = req.params.class_id;
    const queryParams = req.query;
    const result = await studentService.getStudentsByClassId(classId, queryParams);
    return sendResponse(res, 200, true, "Get students by class ID succeeded", result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, error.message, null, error.data);
  }
};

const getClassesByStudentId = async (req, res) => {
  try {
    const studentId = req.params.student_id;
    const queryParams = req.query;
    const result = await studentService.getClassesByStudentId(studentId, queryParams);
    return sendResponse(res, 200, true, "Get classes by student ID succeeded", result);
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
  addStudentToClass,
  removeStudentFromClass,
  getStudentsByClassId,
  getClassesByStudentId,
};
