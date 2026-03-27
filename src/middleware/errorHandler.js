const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    message: err.message || "Internal server error",
    stack: err.stack,
    statusCode: err.statusCode || 500,
  };
  if (err.name === "ValidationError") {
    customError.message = err.details[0].message;
    customError.stack = "";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
