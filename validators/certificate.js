const joi = require('joi');

const certificateSchema = joi.object({
    student_id: joi.number().integer().positive().required(),
    issued_at: joi.string()
        .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
        .required()
        .messages({
            'string.pattern.base': 'Date must be in YYYY-MM-DD format'
        })
});

module.exports = {
    certificateSchema
};