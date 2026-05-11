const scoreService = require("../../services/admin/scoreService");
const { sendResponse } = require('../../utils/responseHelper');

const getAllScores = async (req, res) => {
  try {
    const result = await scoreService.getAllScores();
    return sendResponse(res, 200, true, 'Scores retrieved successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 400, false, error.message);
  }
};

const getScoreById = async (req, res) => {
  try {
    const result = await scoreService.getScoreById(req.params.id);
    return sendResponse(res, 200, true, 'Score retrieved successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 400, false, error.message);
  }
};

const createScore = async (req, res) => {
  try {
    const result = await scoreService.createScore(req.body);
    return sendResponse(res, 201, true, 'Score created successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 400, false, error.message);
  }
};

const updateScore = async (req, res) => {
  try {
    const result = await scoreService.updateScore(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Score updated successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 400, false, error.message);
  }
};

const deleteScore = async (req, res) => {
  try {
    await scoreService.deleteScore(req.params.id);
    return sendResponse(res, 200, true, 'Score deleted successfully');
  } catch (error) {
    return sendResponse(res, error.statusCode || 400, false, error.message);
  }
};

const getStudentScores = async (req, res) => {
  try {
    const result = await scoreService.getStudentScores(req.params.student_id);
    return sendResponse(res, 200, true, 'Student scores retrieved successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 400, false, error.message);
  }
};

const getSubjectScores = async (req, res) => {
  try {
    const result = await scoreService.getSubjectScores(req.params.subject_id);
    return sendResponse(res, 200, true, 'Subject scores retrieved successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 400, false, error.message);
  }
};
// const getClassScoreForm = async (req, res) => {
//   try {
//     const result = await scoreService.getClassScoreForm(
//       req.params.class_id
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Class score form retrieved successfully",
//       data: result,
//     });
//   } catch (error) {
//     return res.status(error.statusCode || 400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

module.exports = {
  getAllScores,
  getScoreById,
  createScore,
  updateScore,
  deleteScore,
  getStudentScores,
  getSubjectScores,
//   getClassScoreForm,
};