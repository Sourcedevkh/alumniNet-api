const Joi = require('joi');

const updateProfileSchema = Joi.object({
    fullname: Joi.string()
        .min(4)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Fullname must be at least 4 characters long',
            'string.max': 'Fullname must not exceed 100 characters'
        }),
    gender: Joi.number()
        .valid(0, 1)
        .optional()
        .messages({
            'any.only': 'Gender must be 0 (Male) or 1 (Female)'
        }),
    phone: Joi.string()
        .pattern(/^\+?[0-9\s\-\(\)]+$/)
        .min(10)
        .max(20)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'string.min': 'Phone number must be at least 10 digits'
        }),
    address: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'Address must not exceed 255 characters'
        })
});

module.exports = {
    updateProfileSchema
};
