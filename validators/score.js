const Joi = require("joi");

const scoreItemSchema = Joi.object({
  student_id: Joi.number().integer().required().messages({
    "number.base": "student_id must be a number",
    "any.required": "student_id is required",
  }),
  subject_id: Joi.number().integer().required().messages({
    "number.base": "subject_id must be a number",
    "any.required": "subject_id is required",
  }),
  score: Joi.number().required().messages({
    "number.base": "score must be a number",
    "any.required": "score is required",
  }),
});

const scoreArraysSchema = Joi.object({
  student_id: Joi.array().items(Joi.number().integer().required()).min(1).required().messages({
    "array.base": "student_id must be an array of numbers",
    "array.min": "student_id must contain at least one item",
    "number.base": "student_id must contain only numbers",
  }),
  subject_id: Joi.array().items(Joi.number().integer().required()).min(1).required().messages({
    "array.base": "subject_id must be an array of numbers",
    "array.min": "subject_id must contain at least one item",
    "number.base": "subject_id must contain only numbers",
  }),
  score: Joi.alternatives().try(
    Joi.array().items(Joi.number().required()).min(1),
    Joi.array().items(Joi.array().items(Joi.number().required()).min(1)).min(1)
  ).required().messages({
    "array.base": "score must be an array of numbers or an array of number arrays",
    "array.min": "score must contain at least one item",
    "number.base": "score must contain only numbers",
  }),
}).custom((value, helpers) => {
  const { student_id, subject_id, score } = value;

  const isNumberArray = score.every((item) => typeof item === "number");
  const isMatrix = score.every(
    (item) => Array.isArray(item) && item.every((v) => typeof v === "number")
  );

  if (isNumberArray) {
    if (student_id.length !== subject_id.length || student_id.length !== score.length) {
      return helpers.error("any.custom", {
        message: "student_id, subject_id and score arrays must have the same length for flat score arrays",
      });
    }
  } else if (isMatrix) {
    if (score.length !== student_id.length) {
      return helpers.error("any.custom", {
        message: "score matrix row count must match student_id length",
      });
    }
    const invalidRow = score.find((row) => row.length !== subject_id.length);
    if (invalidRow) {
      return helpers.error("any.custom", {
        message: "each score matrix row must have the same length as subject_id",
      });
    }
  } else {
    return helpers.error("any.custom", {
      message: "score must be a flat array of numbers or a matrix of numbers",
    });
  }

  return value;
}, "arrays length validation");

const createScoreSchema = Joi.alternatives().try(
  scoreItemSchema,
  Joi.array().items(scoreItemSchema).min(1),
  scoreArraysSchema,
).messages({
  "array.min": "scores array must contain at least one score item",
  "any.custom": "student_id, subject_id and score arrays must have a compatible shape",
});

const updateScoreSchema = Joi.object({
  student_id: Joi.number().integer().required().messages({
    "any.required": "student_id is required",
    "number.base": "student_id must be a number",
    "number.integer": "student_id must be an integer",
  }),

  subject_id: Joi.number().integer().required().messages({
    "any.required": "subject_id is required",
    "number.base": "subject_id must be a number",
    "number.integer": "subject_id must be an integer",
  }),

  score: Joi.number().required().messages({
    "any.required": "score is required",
    "number.base": "score must be a number",
  }),
});

module.exports = {
  createScoreSchema,
  updateScoreSchema,
};