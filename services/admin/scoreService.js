const scoreModel = require("../../models/admin/scoreModel");

const validateScorescore = (score) => {
  const errors = [];

  if (!score.student_id) {
    errors.push("student_id is required");
  }
  if (!score.subject_id) {
    errors.push("subject_id is required");
  }
  if (score.score === undefined || score.score === null || score.score === "") {
    errors.push("score is required");
  }
  if (score.score !== undefined && score.score !== null && isNaN(Number(score.score))) {
    errors.push("score must be a number");
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(", "));
    error.statusCode = 400;
    throw error;
  }

  return {
    student_id: Number(score.student_id),
    subject_id: Number(score.subject_id),
    score: Number(score.score),
  };
};

const ensureStudentExists = async (student_id) => {
  const [student] = await scoreModel.checkStudentIdExist(student_id);
  if (!student) {
    const error = new Error("Student ID not found");
    error.statusCode = 404;
    throw error;
  }
};

const ensureSubjectExists = async (subject_id) => {
  const [subject] = await scoreModel.checkSubjectIdExist(subject_id);
  if (!subject) {
    const error = new Error("Subject ID not found");
    error.statusCode = 404;
    throw error;
  }
};

const getAllScores = async () => {
  return await scoreModel.getAllScores();
};

const getScoreById = async (id) => {
  if (!id) {
    const error = new Error("Score ID is required");
    error.statusCode = 400;
    throw error;
  }

  const rows = await scoreModel.getScoreById(id);
  if (!rows || rows.length === 0) {
    const error = new Error("Score not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

const createScore = async (body) => {
  const validated = validateScorescore(body);
  await ensureStudentExists(validated.student_id);
  await ensureSubjectExists(validated.subject_id);

  const rows = await scoreModel.createScore(validated);
  return rows[0] || rows;
};

const updateScore = async (id, body) => {
  const existing = await getScoreById(id);

  const updatedscore = {
    student_id: body.student_id !== undefined ? body.student_id : existing.student_id,
    subject_id: body.subject_id !== undefined ? body.subject_id : existing.subject_id,
    score: body.score !== undefined ? body.score : existing.score,
  };

  const validated = validateScorescore(updatedscore);
  await ensureStudentExists(validated.student_id);
  await ensureSubjectExists(validated.subject_id);

  const rows = await scoreModel.updateScore(id, validated);
  return rows[0] || rows;
};

const deleteScore = async (id) => {
  await getScoreById(id);
  await scoreModel.deleteScore(id);
  return { deleted: true };
};

const getStudentScores = async (student_id) => {
  if (!student_id) {
    const error = new Error("Student ID is required");
    error.statusCode = 400;
    throw error;
  }

  await ensureStudentExists(student_id);
  return await scoreModel.getStudentAllSubjectsWithScores(student_id);
};
// const getClassScoreForm = async (class_id) => {
//   if (!class_id) {
//     const error = new Error("Class ID is required");
//     error.statusCode = 400;
//     throw error;
//   }

//   return await scoreModel.getClassScoreForm(class_id);
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