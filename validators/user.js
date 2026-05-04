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
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
    password: Jol.string()
        .min(6)
        .required()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'))
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character.',
            'any.required': 'Password is required'
        })
});

const loginUserSchema = Jol.object({
    email: Jol.string().email().required().messages({'any.required': 'Email is required'}),
    password: Jol.string().required().messages({'any.required': 'Password is required'})    
});

const resetVerificationLinkSchema = Jol.object({
    email: Jol.string().email().required().messages({'any.required': 'Email is required'})
});

const resetPasswordSchema = Jol.object({
    newPassword: Jol.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'New password must be at least 6 characters long',
            'any.required': 'New password is required'
        })
});

module.exports = {
    createUserSchema,
    loginUserSchema,
    resetVerificationLinkSchema,
    resetPasswordSchema
}