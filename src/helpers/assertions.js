const CustomError = require("../error/customError");
const { StatusCodes } = require("http-status-codes");

const fetchOrFail = (obj, msg, statusCode) => {
  if (!obj) {
    throw new CustomError(msg, statusCode);
  }
  return obj;
};

const deleteSuccessOrFail = (obj) => {
  if (obj.deletedCount < 1) {
    throw new CustomError(
      "Delete failed. Please try again.",
      StatusCodes.BAD_REQUEST,
    );
  }
  return obj;
};

const buildValidQuery = (query) => {
  const validQuery = Object.entries(query).reduce((acc, obj) => {
    const [key, value] = obj;
    if (key !== "page" && key !== "limit") {
      acc[key] = value;
    }
    return acc;
  }, {});
  return validQuery;
};

module.exports = { fetchOrFail, deleteSuccessOrFail, buildValidQuery };
