const mongoose = require("mongoose");
const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const CustomError = require("../error/customError");
const { StatusCodes } = require("http-status-codes");

const createAndUpdateTransaction = async (body, userID) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const profile = await Profile.create(
        { user: userID, ...body },
        { session },
      );
      const updated = await User.findOneAndUpdate(
        { _id: userID },
        { profile: profile._id },
        { session },
      );
      if (!updated) {
        throw new CustomError("Update failed.", StatusCodes.BAD_REQUEST);
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    await session.endSession();
  }
};

module.exports = createAndUpdateTransaction;
