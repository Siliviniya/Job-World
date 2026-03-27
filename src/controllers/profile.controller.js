const {
  createProfileLogic,
  updateProfileLogic,
  deleteProfileLogic,
} = require("../services/profile.services");
const { StatusCodes } = require("http-status-codes");

const createProfile = async (req, res) => {
  await createProfileLogic(req.body, req.user.userID);
  return res.status(StatusCodes.CREATED).json({ msg: "Profile created" });
};

const updateProfile = async (req, res) => {
  const updatedProfile = await updateProfileLogic(
    req.body,
    req.user.userID,
    req.params.id,
  );
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Update successful", updatedProfile: updatedProfile });
};

const deleteProfile = async (req, res) => {
  await deleteProfileLogic(req.user.userID, req.params.id);
  return res.status(StatusCodes.OK).json({ msg: "Profile deleted" });
};

module.exports = { createProfile, updateProfile, deleteProfile };
