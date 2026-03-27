const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/customError");

const checkRole = async (role) => {
  if (role === "employer") {
    return;
  }
  throw new CustomError("You are not authorized", StatusCodes.UNAUTHORIZED);
};

const createPayload = (user) => {
  const userPayload = {
    role: user.role,
    userID: user._id,
    email: user.email,
    profile: user.profile,
  };
  return userPayload;
};

const sendVerificationEmail = async (email, code) => {
  const message = {
    to: email,
    from: "test@example.com",
    subject: "Verification of account",
    text: "Thank you for verifying your account",
    html: `<strong>Verification code: ${code}</strong>`,
  };
  try {
    await sgMail.send(message);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  checkRole,
  createPayload,
  sendVerificationEmail,
};
