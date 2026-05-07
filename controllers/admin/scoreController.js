const scoreService = require("../../services/admin/scoreService");

const getAllScores = async (req, res) => {
  try {
    const result = await scoreService.getAllScores();
    return res.status(200).json({
      success: true,
      message: "Scores retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getScoreById = async (req, res) => {
  try {
    const result = await scoreService.getScoreById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Score retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const createScore = async (req, res) => {
  try {
    const result = await scoreService.createScore(req.body);
    return res.status(201).json({
      success: true,
      message: "Score created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateScore = async (req, res) => {
  try {
    const result = await scoreService.updateScore(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Score updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteScore = async (req, res) => {
  try {
    await scoreService.deleteScore(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Score deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentScores = async (req, res) => {
  try {
    const result = await scoreService.getStudentScores(req.params.student_id);
    return res.status(200).json({
      success: true,
      message: "Student scores retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
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
//   getClassScoreForm,
};