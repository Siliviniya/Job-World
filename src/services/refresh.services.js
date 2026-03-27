const Token = require("../models/refresh.model");
const crypto = require("crypto");

const createRefreshToken = async (ip, device, userID) => {
  const refreshToken = crypto.randomBytes(70).toString("hex");
  const tokenObject = {
    token: refreshToken,
    user: userID,
    ip: ip,
    device: device,
  };
  const token = await Token.create(tokenObject);
  return token;
};

module.exports = { createRefreshToken };
