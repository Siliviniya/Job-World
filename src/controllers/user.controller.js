const { StatusCodes } = require("http-status-codes");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPasswordUser,
  resetPasswordUser,
  provideNewAccessTokenUser,
} = require("../services/user.services");

const register = async (req, res) => {
  const device = req.headers["user-agent"];
  const user = await registerUser(req.body, req.ip, device);
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Account created successfully", user });
};

const login = async (req, res) => {
  const device = req.headers["user-agent"];
  const user = await loginUser(req.body, req.ip, device);
  res.cookie("refreshToken", user.refreshToken, {
    httpOnly: true,
    signed: process.env.SECRET,
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: new Date(Date.now() + 2592000000),
  });
  return res.status(StatusCodes.OK).json({ msg: "Login successful", user });
};

const logout = async (req, res) => {
  const device = req.headers["user-agent"];
  const token = await logoutUser(req.ip, device, req.user.userID);
  res.clearCookie("refreshToken", { refreshToken: token });
  return res.status(StatusCodes.OK).json({ msg: "Logout successful" });
};

const forgotPassword = async (req, res) => {
  await forgotPasswordUser(req.body.email);
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Verification code sent to your email!" });
};

const resetPassword = async (req, res) => {
  const {
    body: { email, password, repeatPassword },
  } = req;
  await resetPasswordUser(email, password, repeatPassword);
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Password changed successfully" });
};

const provideNewAccessToken = async (req, res) => {
  const {
    signedCookies: { refreshToken },
  } = req;
  const accessToken = await provideNewAccessTokenUser(refreshToken);
  return res.status(StatusCodes.OK).json({ accessToken: accessToken });
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  provideNewAccessToken,
};
