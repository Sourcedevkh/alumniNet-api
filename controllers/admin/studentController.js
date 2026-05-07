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

module.exports = {
  createStudent,
};
