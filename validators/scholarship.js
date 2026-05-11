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

const scholarshipCreateSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .pattern(/^[A-Za-z0-9\s]+$/)
        .required()
        .messages({
            'string.base': 'Scholarship name must be a string',
            'string.empty': 'Scholarship name is required',
            'string.min': 'Scholarship name must be at least 3 characters',
            'string.max': 'Scholarship name must be at most 100 characters',
            'string.pattern.base': 'Scholarship name must contain only letters, numbers and spaces',
            'any.required': 'Scholarship name is required'
        }),
    description: Joi.string()
        .trim()
        .max(255)
        .allow('', null)
        .messages({
            'string.base': 'Description must be a string',
            'string.max': 'Description must be at most 255 characters'
        }),
    type_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .allow(null)
        .messages({
            'number.base': 'Type ID must be a number',
            'number.integer': 'Type ID must be an integer',
            'number.positive': 'Type ID must be positive'
        }),
    subtype_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .allow(null)
        .messages({
            'number.base': 'Subtype ID must be a number',
            'number.integer': 'Subtype ID must be an integer',
            'number.positive': 'Subtype ID must be positive'
        }),
    track_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .allow(null)
        .messages({
            'number.base': 'Track ID must be a number',
            'number.integer': 'Track ID must be an integer',
            'number.positive': 'Track ID must be positive'
        }),
    subjectIds: Joi.array()
        .items(Joi.number().integer().positive())
        .unique()
        .optional()
        .messages({
            'array.base': 'subjectIds must be an array of subject IDs',
            'array.unique': 'subjectIds must not contain duplicate values',
            'number.base': 'subjectIds must contain only valid IDs',
            'number.integer': 'subjectIds must contain only integer IDs',
            'number.positive': 'subjectIds must contain only positive IDs'
        })
});

const scholarshipUpdateSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .pattern(/^[A-Za-z0-9\s]+$/)
        .optional()
        .messages({
            'string.base': 'Scholarship name must be a string',
            'string.empty': 'Scholarship name cannot be empty',
            'string.min': 'Scholarship name must be at least 3 characters',
            'string.max': 'Scholarship name must be at most 100 characters',
            'string.pattern.base': 'Scholarship name must contain only letters, numbers and spaces'
        }),
    description: Joi.string()
        .trim()
        .max(255)
        .allow('', null)
        .optional()
        .messages({
            'string.base': 'Description must be a string',
            'string.max': 'Description must be at most 255 characters'
        }),
    type_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .allow(null)
        .messages({
            'number.base': 'Type ID must be a number',
            'number.integer': 'Type ID must be an integer',
            'number.positive': 'Type ID must be positive'
        }),
    subtype_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .allow(null)
        .messages({
            'number.base': 'Subtype ID must be a number',
            'number.integer': 'Subtype ID must be an integer',
            'number.positive': 'Subtype ID must be positive'
        }),
    track_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .allow(null)
        .messages({
            'number.base': 'Track ID must be a number',
            'number.integer': 'Track ID must be an integer',
            'number.positive': 'Track ID must be positive'
        }),
    subjectIds: Joi.array()
        .items(Joi.number().integer().positive())
        .unique()
        .optional()
        .messages({
            'array.base': 'subjectIds must be an array of subject IDs',
            'array.unique': 'subjectIds must not contain duplicate values',
            'number.base': 'subjectIds must contain only valid IDs',
            'number.integer': 'subjectIds must contain only integer IDs',
            'number.positive': 'subjectIds must contain only positive IDs'
        })
}).or('name', 'description', 'type_id', 'subtype_id', 'track_id', 'subjectIds');

module.exports = {
    scholarshipTypeSchema,
    scholarshipSubjectSchema,
    scholarshipTrackSchema,
    scholarshipCreateSchema,
    scholarshipUpdateSchema
};