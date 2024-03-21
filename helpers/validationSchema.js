const Joi = require("joi");

const authSchema = Joi.object({
  username: Joi.string().min(6).max(30).required().messages({
    "string.min": " must be at minimum 6 characters long",
    "string.max": " must be at most 30 characters long",
  }),
  password: Joi.string()
    .min(6) // Adjust the minimum length as needed
    .max(30)
    .required()
    //   .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d?)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    //   )
    .messages({
      "string.min": "Password length must be at least 6 characters",
      // "string.pattern.base":
      //   "Password must contain at least one uppercase letter, and one special character",
    }),
});

const employerSchema  = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  email: Joi.string().required().trim().email(),
  mobileNo: Joi.string().required().trim().pattern(/^[0-9]{10}$/),
  designation: Joi.string().required(),
  gender: Joi.string().required(),
  course: Joi.array().items(Joi.string()),
  image: Joi.object({
    image: Joi.string().required().valid("jpg", "png"),
    imagePath: Joi.string().required()
  }).required()
});
module.exports = { authSchema,employerSchema };
