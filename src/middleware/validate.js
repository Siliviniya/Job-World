const Joi = require("joi");
const pick = require("../utils/pick");

const validate = (schema) => (req, res, next) => {
  const validSchema = schema;
  const validKeys = Object.keys(validSchema);
  const validReq = pick(req, ["body", "params", "query"]);
  const { error, value } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(validReq);

  if (value) {
    console.log(value);
    validKeys.forEach((key) => {
      Object.assign(req[key], value[key]);
    });
    next();
  } else {
    next(error);
  }
};

module.exports = { validate };
