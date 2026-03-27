const Joi = require("joi");

const createJobValidator = {
  body: Joi.object({
    field: Joi.string().required(),
    yearSalary: Joi.number().required(),
    description: Joi.string().max(1000).required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    position: Joi.string().required(),
  }),
};

const fetchFilteredJobValidator = {
  query: Joi.object({
    field: Joi.string(),
    minSalary: Joi.number().min(10000),
    maxSalary: Joi.number().max(150000),
    category: Joi.string(),
    location: Joi.string(),
    position: Joi.string(),
  }),
};

module.exports = { createJobValidator, fetchFilteredJobValidator };
