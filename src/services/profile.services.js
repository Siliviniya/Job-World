const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/customError");
const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const { deleteSuccessOrFail } = require("../helpers/assertions");
const createAndUpdateTransaction = require("../config/transaction.config");

const createProfileLogic = async (body, userID) => {
  const profile = await Profile.findOne({ user: userID });
  if (profile) {
    throw new CustomError(
      "You already have a profile.",
      StatusCodes.BAD_REQUEST,
    );
  }

  await createAndUpdateTransaction(body, userID);
};

const updateProfileLogic = async (body, userID, profileID) => {
  const updatedProfile = await Profile.findOneAndUpdate(
    {
      _id: profileID,
      user: userID,
    },
    { ...body },
  );
  if (!updatedProfile) {
    throw new CustomError("You are not authroized", StatusCodes.UNAUTHORIZED);
  }
  return updatedProfile;
};

const deleteProfileLogic = async (userID, profileID) => {
  const deletedProfile = await Profile.findOneAndDelete({
    _id: profileID,
    user: userID,
  });
  deleteSuccessOrFail(
    deletedProfile,
    "Delete failed. Please try again.",
    StatusCodes.BAD_REQUEST,
  );
};

module.exports = { createProfileLogic, updateProfileLogic, deleteProfileLogic };
