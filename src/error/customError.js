class CustomError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.isOperational = isOperational;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
