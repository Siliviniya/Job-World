const CustomError = require("../error/customError");
const { StatusCodes } = require("http-status-codes");
const Profile = require("../models/profile.model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadUserImage = async (files, userID) => {
  if (!files.image) {
    throw new CustomError("This is not a file", StatusCodes.BAD_REQUEST);
  }
  const result = await cloudinary.uploader.upload(files.image.tempFilePath, {
    resource_type: "image",
    use_filename: true,
    folder: "profile_image",
  });
  fs.unlinkSync(files.image.tempFilePath);
  const profile = await Profile.findOne({ user: userID });
  if (!profile) {
    throw new CustomError(
      "Invalid credentials. Please try again",
      StatusCodes.NOT_FOUND,
    );
  }
  console.log(result);
  profile.image = result.secure_url;
  await profile.save();
  return result;
};

module.exports = { uploadUserImage };
