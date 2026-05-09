const Joi = require("joi");

const scholarshipTypeSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
            'string.min': 'Class name must be at least 3 characters long',
            'string.max': 'Class name must be at most 10 characters long',
            'string.pattern.base': 'Class name must contain only letters (no numbers allowed)',
            'any.required': 'Class name is required'
        }),
});


const scholarshipSubjectSchema = Joi.object({
    type_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Type ID must be a number',
            'number.integer': 'Type ID must be an integer',
            'number.positive': 'Type ID must be positive',
            'any.required': 'Type ID is required'
        }),

    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters',
            'string.max': 'Name must be at most 50 characters',
            'string.pattern.base': 'Name must contain only letters and spaces',
            'any.required': 'Name is required'
        })
});

const scholarshipTrackSchema = Joi.object({
    subtype_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Subtype ID must be a number',
            'number.integer': 'Subtype ID must be an integer',
            'number.positive': 'Subtype ID must be positive',
            'any.required': 'Subtype ID is required'
        }),

    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters',
            'string.max': 'Name must be at most 50 characters',
            'string.pattern.base': 'Name must contain only letters and spaces',
            'any.required': 'Name is required'
        })
});

module.exports = {
    scholarshipTypeSchema,
    scholarshipSubjectSchema,
    scholarshipTrackSchema
};