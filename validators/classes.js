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

const statusSchema = Joi.object({
    status: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'Status must be a number',
        'any.required': 'Status is required',
        'any.only': 'Status must be 0 (Closed) or 1 (Active)'
    }),
})

module.exports = { 
    classSchema,
    statusSchema,
};