const express = require("express");
const verifyRouter = express.Router();
const {
  verifyUser,
  verifyCode,
  requestForVerification,
  requestNewCode,
} = require("../controllers/verify.controller");
const authenticate = require("../middleware/authenticate");
const authValidator = require("../validator/joi.auth.validator");
const { validate } = require("../middleware/validate");

verifyRouter
  .post(
    "/user",
    validate(authValidator.verificationCodeValidator),
    authenticate,
    verifyUser,
  )
  .post("/code", validate(authValidator.verificationCodeValidator), verifyCode)
  .post("/request_verification", authenticate, requestForVerification)
  .post("/request_code", requestNewCode);

module.exports = verifyRouter;
