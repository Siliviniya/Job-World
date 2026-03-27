const express = require("express");
const uploadRouter = express.Router();
const authenticate = require("../middleware/authenticate");
const uploadController = require("../controllers/upload.controller");

uploadRouter.post("/image", authenticate, uploadController.uploadImage);

module.exports = uploadRouter;
