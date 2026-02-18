export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Extract clean error messages from Joi
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        status: "error",
        message: "Validation Failed",
        errors: errors,
      });
    }
    next();
  };
};
