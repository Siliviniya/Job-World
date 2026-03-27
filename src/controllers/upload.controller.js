const { uploadUserImage } = require("../services/upload.services");
const { StatusCodes } = require("http-status-codes");

const uploadImage = async (req, res) => {
  const { files } = req;
  const uploadedImage = await uploadUserImage(files, req.user.userID);
  return res.status(StatusCodes.OK).json({
    msg: "Image uploaded successfully",
    image: uploadedImage.secure_url,
  });
};

module.exports = { uploadImage };
