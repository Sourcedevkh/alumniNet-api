const Joi = require('joi');

const updateProfileSchema = Joi.object({
    fullname: Joi.string()
        .trim()
        .pattern(/^[A-Za-z\s]+$/)
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Full name is required",
            "string.pattern.base":
                "Full name can only contain letters and spaces",
            "string.min":
                "Full name must be at least 3 characters",
            "string.max":
                "Full name cannot exceed 100 characters",
            "any.required":
                "Full name is required"
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
