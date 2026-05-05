const Jol = require('joi');

const createUserSchema = Jol.object({
    name: Jol.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'any.required': 'Name is required'
        }),
    email: Jol.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
            'any.required': 'Email is required'
        }),
    password: Jol.string()
        .min(8)
        .required()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character',
            'any.required': 'Password is required'
        })
});

const loginUserSchema = Jol.object({
    email: Jol.string().email().required().messages({ 'any.required': 'Email is required' }),
    password: Jol.string().required().messages({ 'any.required': 'Password is required' })
});

const emailSchema = Jol.object({
    email: Jol.string().email().required().messages({
        'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
        'any.required': 'Email is required'
    })
});

const codeOTPSchema = Jol.object({
    code: Jol.string().length(6).alphanum().required().messages({
        'string.length': 'OTP code must be 6 digits',
        'string.alphanum': 'OTP code must be alphanumeric',
        'any.required': 'OTP code is required'
    })
})

const verifyOTPSchema = Jol.object({
    email: Jol.string().email().required().messages({
        'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
        'any.required': 'Email is required'
    }),
    code: Jol.string().length(6).alphanum().required().messages({
        'string.length': 'OTP code must be 6 digits',
        'string.alphanum': 'OTP code must be alphanumeric',
        'any.required': 'OTP code is required'
    })
})

const resetVerificationLinkSchema = Jol.object({
    email: Jol.string().email().required().messages({
        'string.email': 'Please provide a valid email address (e.g., name@domain.com)',
        'any.required': 'Email is required'
    })
});

const resetPasswordSchema = Jol.object({
    token: Jol.string().required().messages({
        'any.required': 'Reset token is required'
    }),
    password: Jol.string()
        .min(8)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-])/)
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character',
            'any.required': 'Password is required'
        }),
    confirm_password: Jol.any()
        .equal(Jol.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Please confirm your password'
        })
});

module.exports = {
    createUserSchema,
    loginUserSchema,
    emailSchema,
    resetVerificationLinkSchema,
    resetPasswordSchema,
    codeOTPSchema,
    verifyOTPSchema
}