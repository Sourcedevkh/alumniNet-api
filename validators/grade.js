const Joi = require('joi');

const gradeSchema = Joi.object({
    student_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'student_id must be a number',
            'number.integer': 'student_id must be an integer',
            'number.positive': 'student_id must be positive',
            'any.required': 'student_id is required'
        }),

    grade: Joi.string()
        .trim()
        .uppercase()
        .valid('A', 'B', 'C', 'D', 'E', 'F')
        .required()
        .messages({
            'string.base': 'grade must be a string',
            'string.empty': 'grade cannot be empty',
            'any.only': 'grade must be A, B, C, D, E or F',
            'any.required': 'grade is required'
        }),

    gpa: Joi.number()
        .min(0)
        .max(4)
        .precision(2)
        .required()
        .messages({
            'number.base': 'gpa must be a number',
            'number.min': 'gpa cannot be less than 0',
            'number.max': 'gpa cannot be greater than 4',
            'any.required': 'gpa is required'
        })
});

module.exports = {
    gradeSchema
};