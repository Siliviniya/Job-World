const express = require("express");
const authRouter = express.Router();
const authenticate = require("../middleware/authenticate");
const authController = require("../controllers/user.controller");
const authValidator = require("../validator/joi.auth.validator");
const { validate } = require("../middleware/validate");

authRouter
  .post(
    "/register",
    validate(authValidator.registerValidator),
    authController.register,
  )
  .post("/login", validate(authValidator.loginValidator), authController.login)
  .post("/logout", authenticate, authController.logout)
  .post("/forgot_password", authController.forgotPassword)
  .post(
    "/reset_password",
    validate(authValidator.resetPasswordValidator),
    authController.resetPassword,
  )
  .post(
    "/request_refreshtoken",
    authenticate,
    authController.provideNewAccessToken,
  );

module.exports = authRouter;
