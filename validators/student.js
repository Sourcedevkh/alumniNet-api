const Joi = require("joi");

const studentSchema = Joi.object({
  student_id: Joi.number()
    .integer()
    .positive()
    .required()
    .strict()
    .messages({
      "number.base": "student_id must be a number",
      "number.integer": "student_id must be an integer",
      "number.positive": "student_id must be a positive number",
      "any.required": "student_id is required",
    }),

  class_id: Joi.number()
    .integer()
    .positive()
    .required()
    .strict()
    .messages({
      "number.base": "class_id must be a number",
      "number.integer": "class_id must be an integer",
      "number.positive": "class_id must be a positive number",
      "any.required": "class_id is required",
    }),
})
  .options({
    abortEarly: false,        
    stripUnknown: true,     
    convert: true,            
  });

module.exports = {
    studentSchema
};