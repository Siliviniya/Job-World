const CustomError = require("../error/customError");
const { verifyJWT } = require("../utils/jwt");
const User = require("../models/user.model");
const { createPayload } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.signedCookies.token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const payload = verifyJWT(token, process.env.SECRET_CODE);
    const user = await User.findOne({ _id: payload.id });
    const userDetail = createPayload(user);
    req.user = userDetail;
    next();
  } else if (cookieToken) {
    const token = cookieToken;
    const payload = verifyJWT(token, process.env.SECRET_CODE);
    const user = await User.findOne({ _id: payload.id });
    const userDetail = createPayload(user);
    req.user = userDetail;
    next();
  } else {
    throw new CustomError("You are not authorized", StatusCodes.UNAUTHORIZED);
  }
};

module.exports = authenticate;
