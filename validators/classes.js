const Joi = require('joi');

const classSchema = Joi.object({
    name: Joi.string().min(3).max(10).required().messages({
        'string.min': 'Class name must be at least 3 characters long',
        'string.max': 'Class name must be at most 10 characters long',
        'any.required': 'Class name is required'
    }),
    description: Joi.string().allow('', null),
    generation_id: Joi.number().integer().required().messages({'number.base': 'Generation ID must be a number',}),
    scholarship_id: Joi.number().integer().required().messages({'number.base': 'Scholarship ID must be a number',}),
    shift_id: Joi.number().integer().required().messages({'number.base': 'Shift ID must be a number',}),
});

module.exports = { classSchema };