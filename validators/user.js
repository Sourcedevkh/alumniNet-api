const Joi = require('joi');

const createUserSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'any.required': 'Name is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
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
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
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
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
        'any.required': 'Email is required'
    }),
    code: Joi.string().length(6).alphanum().required().messages({
        'string.length': 'OTP code must be 6 digits',
        'string.alphanum': 'OTP code must be alphanumeric',
        'any.required': 'OTP code is required'
    })
})

const resetVerificationLinkSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
        'any.required': 'Email is required'
    })
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

const createStudent = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'any.required': 'Name is required'
        }),
    phone: Joi.string()
        .min(7)
        .pattern(/^[0-9]+$/)
        .allow('', null)
        .optional()
        .messages({
            'string.min': 'Phone number must be at least 7 characters long',
            'string.pattern.base': 'Phone number must contain only digits' 
        }),
    gender: Joi.number()
        .valid(0, 1)
        .empty('')
        .default(0)
        .messages({
            'any.only': 'Gender must be 0 (Male) or 1 (Female)'
        }),
    status: Joi.string()
        // .valid('Graduate', 'Studying', 'Suspend')
        .empty('')
        .default('Graduate')
        .messages({
            'string.base': 'Status must be (Text)'
        }),
    generation_id: Joi.number()
        .required()
        .messages({
            'any.required': 'Generation is required'
        }),
    scholarship_id: Joi.number()
        .required()
        .messages({
            'any.required': 'Scholarship is required'
        }),
    class_id: Joi.number()
        .required()
        .messages({
            'any.required': 'Class is required'
        }),
    shift_id: Joi.number()
        .required()
        .messages({
            'any.required': 'Shift is required'
        }),
})

module.exports = {
    createUserSchema,
    loginUserSchema,
    emailSchema,
    resetVerificationLinkSchema,
    resetPasswordSchema,
    codeOTPSchema,
    verifyOTPSchema,
    resetAdminSchema,
    createStudent
}