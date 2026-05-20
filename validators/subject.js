const Joi = require("joi");

const createSubjectSchema = Joi.object({

    name: Joi.string()
        .trim()
        .pattern(/^(?=.*[A-Za-z])[A-Za-z0-9\s]+$/)
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty":
                "Name cannot be empty",

            "string.pattern.base":
                "Name must contain at least one letter and only letters, numbers, and spaces are allowed",

            "string.min":
                "Name must be at least 2 characters",

            "string.max":
                "Name cannot exceed 100 characters",

            "any.required":
                "Name is required"
        }),

    description: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.max":
                "Description cannot exceed 500 characters"
        })

})
.options({
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
});



const updateSubjectSchema = Joi.object({

   name: Joi.string()
        .trim()
        .pattern(/^(?=.*[A-Za-z])[A-Za-z0-9\s]+$/)
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty":
                "Name cannot be empty",

            "string.pattern.base":
                "Name must contain at least one letter and only letters, numbers, and spaces are allowed",

            "string.min":
                "Name must be at least 2 characters",

            "string.max":
                "Name cannot exceed 100 characters",

            "any.required":
                "Name is required"
        }),

    description: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.max":
                "Description cannot exceed 500 characters"
        })

})
.options({
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
});


module.exports = {
    createSubjectSchema,
    updateSubjectSchema
};