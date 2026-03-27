const { StatusCodes } = require("http-status-codes");
const {
  verifyUserOrFail,
  verifyCodeOrFail,
  requestForUserVerification,
} = require("../services/verify.services");

const verifyUser = async (req, res) => {
  await verifyUserOrFail(req.user.email, req.body.verificationCode);
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Your account has been verified!" });
};

const requestForVerification = async (req, res) => {
  console.log(req.user);
  await requestForUserVerification(req.user.email);
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Verification code sent to your email!" });
};

const requestNewCode = async (req, res) => {
  await requestForUserVerification(req.body.email);
  return res.status(StatusCodes.OK).json({ msg: "Code has been sent!" });
};

const verifyCode = async (req, res) => {
  await verifyCodeOrFail(req.body.email, req.body.verificationCode);
  return res.status(StatusCodes.OK).json({ msg: "Verification successful" });
};

module.exports = {
  verifyUser,
  verifyCode,
  requestForVerification,
  requestNewCode,
};
