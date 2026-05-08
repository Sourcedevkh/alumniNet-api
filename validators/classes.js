const Joi = require('joi');

const classSchema = Joi.object({
    name: Joi.string().min(2).max(10).trim().required()
        .messages({
            'string.empty': 'Class name cannot be empty',
            'string.min': 'Class name must be at least 2 characters',
            'any.required': 'Class name is required'
        }),
    description: Joi.string().max(500).allow('', null)
});

module.exports = { classSchema };