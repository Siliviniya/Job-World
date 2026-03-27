const User = require("../models/user.model");
const Token = require("../models/refresh.model");
const VerificationCode = require("../models/verify_code.model");
const CustomError = require("../error/customError");
const { createRefreshToken } = require("./refresh.services");
const { createVerificationCode } = require("../services/verify.services");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { createJWT } = require("../utils/jwt");
const { createPayload, sendVerificationEmail } = require("../utils/utils");
const { fetchOrFail, deleteSuccessOrFail } = require("../helpers/assertions");

const registerUser = async (body, ip, device) => {
  const { name, email, password } = body;
  const alreadyRegistered = await User.findOne({ email });
  if (alreadyRegistered) {
    throw new CustomError(
      "Email already in use. Please try again.",
      StatusCodes.BAD_REQUEST,
    );
  }
  const adminRole = (await User.countDocuments({})) === 0;

  const userData = {
    name,
    email,
    password,
    ip,
    device,
    role: adminRole ? "admin" : "user",
  };
  if (userData.role === "admin") {
    const adminUser = await User.create(userData);
    return adminUser;
  } else {
    const user = await User.create(userData);
    return user;
  }
};

const loginUser = async (body, ip, device) => {
  const { email, password } = body;
  const user = await User.findOne({ email });
  fetchOrFail(user, "User not found. Please try again.", StatusCodes.NOT_FOUND);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError(
      "Invalid credentials. Please try again.",
      StatusCodes.NOT_FOUND,
    );
  }
  const refreshToken = await createRefreshToken(ip, device, user._id);
  const accessToken = createJWT({ id: user._id });
  const userData = createPayload(user);
  return { userData, accessToken, refreshToken };
};

const logoutUser = async (ip, device, userID) => {
  const deleted = await Token.findOneAndDelete({ user: userID, ip, device });
  const deletedData = deleteSuccessOrFail(deleted);
  return deletedData.token;
};

const forgotPasswordUser = async (email) => {
  const user = await User.findOne({ email });
  fetchOrFail(user, "User not found. Please try again.", StatusCodes.NOT_FOUND);
  const verificationCode = await createVerificationCode(email);
  await sendVerificationEmail(email, verificationCode.verificationCode);
};

const resetPasswordUser = async (email, password, repeatPassword) => {
  const user = await User.findOne({ email });
  fetchOrFail(user, "User not found. Please try again.", StatusCodes.NOT_FOUND);

  if (repeatPassword !== password) {
    throw (
      new CustomError("Typed password does not match"),
      StatusCodes.NOT_FOUND
    );
  }
  user.password = repeatPassword;
  await user.save();
  await VerificationCode.deleteOne({ email: email });
};

const provideNewAccessTokenUser = async (refreshToken) => {
  const token = await Token.findOne({ refreshToken: refreshToken });
  fetchOrFail(
    token,
    "Token does not exist. Please try again.",
    StatusCodes.NOT_FOUND,
  );
  if (token.isRevoked === true) {
    throw new CustomError(
      "Invalid token. Please try again.",
      StatusCodes.BAD_REQUEST,
    );
  }
  const accessToken = createJWT(token.user);
  const deleted = await Token.deleteOne({ user: token.user });
  deleteSuccessOrFail(deleted);
  return accessToken;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPasswordUser,
  resetPasswordUser,
  provideNewAccessTokenUser,
};
