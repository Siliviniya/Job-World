const express = require("express");
const profileRouter = express.Router();
const authenticate = require("../middleware/authenticate");
const profileController = require("../controllers/profile.controller");
const { validate } = require("../middleware/validate");
const profileValidator = require("../validator/joi.profile.validator");

profileRouter
  .post(
    "/create",
    authenticate,
    validate(profileValidator.createProfileValidator),
    profileController.createProfile,
  )
  .patch(
    "/update/:id",
    authenticate,
    validate(profileValidator.updateProfileValidator),
    profileController.updateProfile,
  )
  .delete("/delete/:id", authenticate, profileController.deleteProfile);

module.exports = profileRouter;
