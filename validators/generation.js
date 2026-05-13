const Joi = require("joi");

const generationSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(150)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name cannot exceed 150 characters",
            "any.required": "Name is required"
        }),

    description: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .allow("")
        .optional()
        .messages({
            "string.min": "Description must be at least 5 characters",
            "string.max": "Description cannot exceed 500 characters"
        }),

    start_year: Joi.number()
        .integer()
        .min(2000)
        .max(2100)
        .required()
        .messages({
            "number.base": "Start year must be a number",
            "number.min": "Start year is invalid",
            "number.max": "Start year is invalid",
            "any.required": "Start year is required"
        }),

    end_year: Joi.number()
        .integer()
        .greater(Joi.ref("start_year"))
        .required()
        .messages({
            "number.greater": "End year must be greater than start year",
            "any.required": "End year is required"
        }),

    scholarship_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Scholarship ID must be a number",
            "number.positive": "Scholarship ID must be positive",
            "any.required": "Scholarship ID is required"
        }),

    intake_month: Joi.string()
        .pattern(/^(0?[1-9]|1[0-2])$/)
        .required()
        .messages({
            "string.pattern.base": "Intake month must be between 1 and 12",
            "any.required": "Intake month is required"
        }),

    is_active: Joi.number()
        .valid(0, 1)
        .required()
        .messages({
            "any.only": "is_active must be 0 or 1",
            "any.required": "is_active is required"
        })

})
    .options({
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
    });

module.exports = {
  generationSchema
}