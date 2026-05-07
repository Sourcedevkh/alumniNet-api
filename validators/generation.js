const Joi = require("joi");

const createGenerationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  description: Joi.string().allow("", null).optional(),

  start_year: Joi.number().integer().required(),

  end_year: Joi.number().integer().required(),

  scholarship_id: Joi.number().integer().required(),

  intake_month: Joi.number().integer().min(1).required().messages({
    "number.base": "intake_month ត្រូវតែជាលេខ",
    "number.min": "ចំនួនខែយ៉ាងតិចគឺ ១ ខែ",
    "any.required": "សូមបញ្ចូលចំនួនខែ",
  }),
});

const validateCreateGeneration = (req, res, next) => {
  const { error } = createGenerationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  createGenerationSchema,
  validateCreateGeneration,
};
