const Joi = require("joi");

const createProfileValidator = {
  body: Joi.object({
    name: Joi.string().min(3).max(20).required(),
    age: Joi.number().required(),
    address: Joi.string().required(),
    contact: Joi.number().required(),
    selfDescription: Joi.string().max(1000).required(),
    career: Joi.string().max(500).required(),
    education: Joi.string().max(100).required(),
  }),
};

const updateProfileValidator = {
  body: Joi.object({
    name: Joi.string().min(3).max(20),
    age: Joi.number(),
    address: Joi.string(),
    contact: Joi.number(),
    selfDescription: Joi.string().max(1000),
    career: Joi.string().max(500),
    education: Joi.string().max(100),
  }),
};

module.exports = { createProfileValidator, updateProfileValidator };
