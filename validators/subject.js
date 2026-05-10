const Joi = require('joi');

const createSubjectSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required'
    }),
  description: Joi.string()
    .trim()
    .allow('', null)
    .optional()
});

const updateSubjectSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .messages({
      'string.empty': 'Name cannot be empty'
    }),
  description: Joi.string()
    .trim()
    .allow('', null)
    .optional()
});

module.exports = {
  createSubjectSchema,
  updateSubjectSchema
};
