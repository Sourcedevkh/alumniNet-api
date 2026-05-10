const scoreModel = require("../../models/admin/scoreModel");
const { createScoreSchema, updateScoreSchema } = require('../../validators/score');

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
  const { error, value } = createScoreSchema.validate(body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  await ensureStudentExists(value.student_id);
  await ensureSubjectExists(value.subject_id);

  const rows = await scoreModel.createScore(value);
  return rows[0] || rows;
};

const updateScore = async (id, body) => {
  const existing = await getScoreById(id);

  const updatedscore = {
    student_id: body.student_id !== undefined ? body.student_id : existing.student_id,
    subject_id: body.subject_id !== undefined ? body.subject_id : existing.subject_id,
    score: body.score !== undefined ? body.score : existing.score,
  };

  const { error, value } = updateScoreSchema.validate(updatedscore, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  await ensureStudentExists(value.student_id);
  await ensureSubjectExists(value.subject_id);

  const rows = await scoreModel.updateScore(id, value);
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

const getSubjectScores = async (subject_id) => {
  if (!subject_id) {
    const error = new Error("Subject ID is required");
    error.statusCode = 400;
    throw error;
  }

  await ensureSubjectExists(subject_id);
  return await scoreModel.getScoresBySubjectId(subject_id);
};

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
