const Joi = require('joi');

const classSchema = Joi.object({
  name: Joi.string()
    .trim()
    .strict()
    .min(1)
    .max(50)
    .pattern(/^[A-Za-z0-9\s\-]+$/) 
    .required()
    .messages({
      "string.base": "name must be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name is too short",
      "string.max": "name is too long",
      "string.pattern.base":
        "name contains invalid characters (only letters, numbers, space, - allowed)",
      "any.required": "name is required",
    }),

  description: Joi.string()
    .trim()
    .strict()
    .max(255)
    .pattern(/^[^<>$'"`]*$/) 
    .allow("", null)
    .messages({
      "string.max": "description too long",
      "string.pattern.base":
        "description contains forbidden characters",
    }),

  generation_id: Joi.number()
    .integer()
    .positive()
    .strict()
    .required()
    .messages({
      "number.base": "generation_id must be a number",
      "number.integer": "generation_id must be integer",
      "number.positive": "generation_id must be positive",
      "any.required": "generation_id is required",
    }),

  scholarship_id: Joi.number()
    .integer()
    .positive()
    .strict()
    .required(),

  shift_id: Joi.number()
    .integer()
    .positive()
    .strict()
    .required(),
})
  .options({
    abortEarly: false,    
    stripUnknown: true,    
    convert: true,        
    allowUnknown: false,  
  });


const statusSchema = Joi.object({
    status: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'Status must be a number',
        'any.required': 'Status is required',
        'any.only': 'Status must be 0 (Closed) or 1 (Active)'
    }),
})

module.exports = { 
    classSchema,
    statusSchema,
};