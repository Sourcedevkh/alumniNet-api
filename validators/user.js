const Joi = require('joi');

const createUserSchema = Joi.object({
    fullname: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.base': 'Fullname must be a string',
            'string.empty': 'Fullname cannot be empty',
            'string.min': 'Fullname must be at least 3 characters long',
            'string.max': 'Fullname cannot exceed 50 characters',
            'string.pattern.base': 'Fullname must only contain letters and spaces',
            'any.required': 'Fullname is required'
        }),

    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/)
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email cannot be empty',
            'string.pattern.base': 'Please provide a valid email address (e.g., name@domain.com)',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(8)
        .required()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character',
            'any.required': 'Password is required'
        })
});

const loginUserSchema = Joi.object({
    email: Joi.string().email().required().messages({ 'any.required': 'Email is required' }),
    password: Joi.string().required().messages({ 'any.required': 'Password is required' })
});

const emailSchema = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/)
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email cannot be empty',
            'string.pattern.base': 'Please provide a valid email address (e.g., name@domain.com)',
            'any.required': 'Email is required'
        })
});

const codeOTPSchema = Joi.object({
    code: Joi.string().length(6).alphanum().required().messages({
        'string.length': 'OTP code must be 6 digits',
        'string.alphanum': 'OTP code must be alphanumeric',
        'any.required': 'OTP code is required'
    })
})

const verifyOTPSchema = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/)
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email cannot be empty',
            'string.pattern.base': 'Please provide a valid email address (e.g., name@domain.com)',
            'any.required': 'Email is required'
        }),
    code: Joi.string().length(6).alphanum().required().messages({
        'string.length': 'OTP code must be 6 digits',
        'string.alphanum': 'OTP code must be alphanumeric',
        'any.required': 'OTP code is required'
    })
})

const resetVerificationLinkSchema = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/)
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email cannot be empty',
            'string.pattern.base': 'Please provide a valid email address (e.g., name@domain.com)',
            'any.required': 'Email is required'
        }),
        'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
        'any.required': 'Email is required'
});

const resetPasswordSchema = Joi.object({
    token: Joi.string()
        .required()
        .messages({
            'string.empty': 'Security token cannot be empty',
            'any.required': 'Security token is missing'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-])/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must include upper, lower, number, and special character',
            'any.required': 'New password is required'
        }),

    confirm_password: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Please confirm your password'
        })
});

const resetAdminSchema = Joi.object({
    newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-])/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must include upper, lower, number, and special character',
            'any.required': 'New password is required'
        }),
});

const statusSchema = Joi.object({
    status: Joi.number()
        .integer()
        .valid(0, 1)
        .required()
        .messages({
            'number.base': 'Status must be a number',
            'number.integer': 'Status must be an integer',
            'any.only': 'Status must be 0 (disable) or 1 (enable)',
            'any.required': 'Status is required'
        })
})


const createStudent = Joi.object({

    fullname: Joi.string()
        .trim()
        .pattern(/^[A-Za-z\u1780-\u17FF\s]+$/)
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "Full name is required",
            "string.pattern.base":
                "Full name can only contain English letters, Khmer letters, and spaces",
            "string.min":
                "Full name must be at least 3 characters long",
            "string.max":
                "Full name cannot exceed 50 characters",
            "any.required":
                "Full name is required"
        }),

    phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{7,15}$/)
        .allow("", null)
        .optional()
        .messages({
            "string.pattern.base":
                "Phone number must contain only digits and be between 7 and 15 numbers"
        }),

    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/)
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email cannot be empty',
            'string.pattern.base': 'Please provide a valid email address (e.g., name@domain.com)',
            'any.required': 'Email is required'
        }),
        'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
        'any.required': 'Email is required',

    gender: Joi.number()
        .integer()
        .valid(0, 1)
        .empty("")
        .default(0)
        .messages({
            "any.only":
                "Gender must be 0 (Male) or 1 (Female)"
        }),

    status: Joi.string()
        .trim()
        .valid("Graduate")
        .empty("")
        .default("Graduate")
        .messages({
            "any.only":
                "Status must be Graduate, Studying, or Suspend"
        }),

    generation_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base":
                "Generation ID must be a number",
            "number.positive":
                "Generation ID must be positive",
            "any.required":
                "Generation is required"
        }),

    scholarship_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base":
                "Scholarship ID must be a number",
            "number.positive":
                "Scholarship ID must be positive",
            "any.required":
                "Scholarship is required"
        }),

    shift_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base":
                "Shift ID must be a number",
            "number.positive":
                "Shift ID must be positive",
            "any.required":
                "Shift is required"
        }),

})
    .options({
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
    });

module.exports = {
    createUserSchema,
    loginUserSchema,
    emailSchema,
    resetVerificationLinkSchema,
    resetPasswordSchema,
    codeOTPSchema,
    verifyOTPSchema,
    resetAdminSchema,
    createStudent,
    statusSchema
}