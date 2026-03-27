const Joi = require("joi");

const registerValidator = {
  body: Joi.object({
    username: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(12).required(),
    role: Joi.string().valid("user", "employer"),
  }),
};

const loginValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(12).required(),
  }),
};

const resetPasswordValidator = {
  body: Joi.object({
    password: Joi.string().min(8).max(12).required(),
    repeatPassword: Joi.string().min(8).max(12).required(),
  }),
};

const verificationCodeValidator = {
  body: Joi.object({
    verificationCode: Joi.number().min(6).max(6).required(),
  }),
};

module.exports = {
  registerValidator,
  loginValidator,
  resetPasswordValidator,
  verificationCodeValidator,
};
