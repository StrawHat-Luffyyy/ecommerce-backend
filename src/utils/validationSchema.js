import Joi from "joi";

// Schema for registration
export const registrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  firstName: Joi.string().min(2).max(30).optional(),
  lastName: Joi.string().min(2).max(30).optional(),
});

// Schema for login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});