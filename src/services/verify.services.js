const User = require("../models/user.model");
const VerificationCode = require("../models/verify_code.model");
const crypto = require("crypto");
const CustomError = require("../error/customError");
const { StatusCodes } = require("http-status-codes");
const { sendVerificationEmail } = require("../utils/utils");
const { fetchOrFail, deleteSuccessOrFail } = require("../helpers/assertions");

const createVerificationCode = async (email) => {
  const verificationCode = crypto.randomInt(100000, 1000000);
  const created = await VerificationCode.create({
    verificationCode,
    email,
  });
  if (!created) {
    throw new CustomError("Data creation failed", StatusCodes.BAD_REQUEST);
  }
  return created.verificationCode;
};

const requestForUserVerification = async (email) => {
  const user = await User.findOne({ email });
  fetchOrFail(user, "User not found. Please try again.", StatusCodes.NOT_FOUND);
  const verificationCode = await createVerificationCode(email);
  await sendVerificationEmail(email, verificationCode);
};

const verifyVerificationCode = (userCode, dbCode) => {
  if (!dbCode) {
    throw new CustomError(
      "Code expired. Please request new code",
      StatusCodes.NOT_FOUND,
    );
  }
  if (userCode !== dbCode.verificationCode) {
    throw new CustomError(
      "Code does not match. Please try again.",
      StatusCodes.BAD_REQUEST,
    );
  }
  return;
};

const verifyCodeOrFail = async (email, verificationCode) => {
  const code = await VerificationCode.findOne({ email });
  verifyVerificationCode(verificationCode, code);

  const deleted = await VerificationCode.deleteOne({ email });
  deleteSuccessOrFail(deleted);
};

const verifyUserOrFail = async (email, verificationCode) => {
  const user = await User.findOne({ email });
  fetchOrFail(user, "User not found. Please try again.", StatusCodes.NOT_FOUND);

  const code = await VerificationCode.findOne({ email });
  verifyVerificationCode(verificationCode, code);

  user.isVerified = true;
  await user.save();

  const deleted = await VerificationCode.deleteOne({ email });
  deleteSuccessOrFail(deleted);
};

module.exports = {
  verifyUserOrFail,
  requestForUserVerification,
  createVerificationCode,
  verifyCodeOrFail,
};
