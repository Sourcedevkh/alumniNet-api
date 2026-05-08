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

module.exports = {
  createScoreSchema,
};