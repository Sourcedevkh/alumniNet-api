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

  let items = [];
  if (Array.isArray(value)) {
    items = value;
  } else if (
    value.student_id &&
    Array.isArray(value.student_id) &&
    Array.isArray(value.subject_id) &&
    Array.isArray(value.score)
  ) {
    const isNumberArray = value.score.every((item) => typeof item === "number");
    const isMatrix = value.score.every(
      (item) => Array.isArray(item) && item.every((scoreValue) => typeof scoreValue === "number")
    );

    if (isNumberArray) {
      items = value.student_id.map((student_id, index) => ({
        student_id,
        subject_id: value.subject_id[index],
        score: value.score[index],
      }));
    } else if (isMatrix) {
      items = value.student_id.flatMap((student_id, rowIndex) =>
        value.score[rowIndex].map((scoreValue, colIndex) => ({
          student_id,
          subject_id: value.subject_id[colIndex],
          score: scoreValue,
        }))
      );
    } else {
      items = [value];
    }
  } else {
    items = [value];
  }

  const uniqueStudentIds = [...new Set(items.map((item) => item.student_id))];
  const uniqueSubjectIds = [...new Set(items.map((item) => item.subject_id))];

  await Promise.all(uniqueStudentIds.map(ensureStudentExists));
  await Promise.all(uniqueSubjectIds.map(ensureSubjectExists));

  const createdScores = [];
  for (const item of items) {
    const rows = await scoreModel.createScore(item);
    createdScores.push(rows[0] || rows);
  }

  return Array.isArray(value) ||
    (value.student_id && Array.isArray(value.student_id))
    ? createdScores
    : createdScores[0];
};

const updateScoresBatch = async (body) => {
  const { error, value } = createScoreSchema.validate(body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  let items = [];
  if (Array.isArray(value)) {
    items = value;
  } else if (
    value.student_id &&
    Array.isArray(value.student_id) &&
    Array.isArray(value.subject_id) &&
    Array.isArray(value.score)
  ) {
    const isNumberArray = value.score.every((item) => typeof item === "number");
    const isMatrix = value.score.every(
      (item) => Array.isArray(item) && item.every((scoreValue) => typeof scoreValue === "number")
    );

    if (isNumberArray) {
      items = value.student_id.map((student_id, index) => ({
        student_id,
        subject_id: value.subject_id[index],
        score: value.score[index],
      }));
    } else if (isMatrix) {
      items = value.student_id.flatMap((student_id, rowIndex) =>
        value.score[rowIndex].map((scoreValue, colIndex) => ({
          student_id,
          subject_id: value.subject_id[colIndex],
          score: scoreValue,
        }))
      );
    } else {
      items = [value];
    }
  } else {
    items = [value];
  }

  const uniqueStudentIds = [...new Set(items.map((item) => item.student_id))];
  const uniqueSubjectIds = [...new Set(items.map((item) => item.subject_id))];

  await Promise.all(uniqueStudentIds.map(ensureStudentExists));
  await Promise.all(uniqueSubjectIds.map(ensureSubjectExists));

  const savedScores = [];
  for (const item of items) {
    const existing = await scoreModel.getScoreByStudentAndSubject(item.student_id, item.subject_id);
    if (existing && existing.length > 0) {
      const rows = await scoreModel.updateScore(existing[0].id, item);
      savedScores.push(rows[0] || rows);
    } else {
      const rows = await scoreModel.createScore(item);
      savedScores.push(rows[0] || rows);
    }
  }

  return Array.isArray(value) ||
    (value.student_id && Array.isArray(value.student_id))
    ? savedScores
    : savedScores[0];
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
  updateScoresBatch,
  deleteScore,
  getStudentScores,
  getSubjectScores,
};
