const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
  return jwt.sign(payload, process.env.SECRET_CODE);
};

const verifyJWT = (token) => {
  return jwt.verify(token, process.env.SECRET_CODE);
};

module.exports = { createJWT, verifyJWT };
