const express = require("express");
const jobRouter = express.Router();
const authenticate = require("../middleware/authenticate");
const { validate } = require("../middleware/validate");
const jobValidator = require("../validator/joi.job.validator");

const {
  uploadJob,
  updateJob,
  deleteJob,
  applyJob,
  fetchFilteredJob,
} = require("../controllers/job.controller");

jobRouter
  .post(
    "/upload",
    validate(jobValidator.createJobValidator),
    authenticate,
    uploadJob,
  )
  .get(
    "/search",
    validate(jobValidator.fetchFilteredJobValidator),
    fetchFilteredJob,
  )
  .patch("/update/:id", authenticate, updateJob)
  .delete("/delete/:id", authenticate, deleteJob);
jobRouter.post("/apply/:id", authenticate, applyJob);

module.exports = jobRouter;
