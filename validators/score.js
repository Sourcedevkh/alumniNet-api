const Joi = require("joi");

const createScoreSchema = Joi.object({
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