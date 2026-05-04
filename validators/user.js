const jol = require('joi');

const createUserSchema = jol.object({
    name: jol.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'any.required': 'Name is required'
        }),
    email: jol.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
    password: jol.string()
        .min(6)
        .required()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'))
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character.',
            'any.required': 'Password is required'
        })
});

const loginUserSchema = jol.object({
    email: jol.string().email().required(),
    password: jol.string().required()    
});

const resetVerificationLinkSchema = jol.object({
    email: jol.string().email().required()
});

module.exports = {
    createUserSchema,
    loginUserSchema,
    resetVerificationLinkSchema
}