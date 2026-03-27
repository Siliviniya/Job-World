const {
  uploadJobService,
  updateJobService,
  deleteJobService,
  applyJobService,
  fetchFilteredJobService,
} = require("../services/job.services");
const { StatusCodes } = require("http-status-codes");

const uploadJob = async (req, res) => {
  const job = await uploadJobService(req.body, req.user.userID);
  return res
    .status(StatusCodes.CREATED)
    .json({ msg: "Job uploaded successfully", job });
};

const updateJob = async (req, res) => {
  await updateJobService(
    req.body,
    req.user.userID,
    req.params.id,
    req.user.role,
  );
  return res.status(StatusCodes.OK).json({
    msg: "Job updated successfully",
  });
};

const deleteJob = async (req, res) => {
  await deleteJobService(req.user.userID, req.params.id);
  return res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
};

const applyJob = async (req, res) => {
  await applyJobService(req.user.userID, req.params.id, req.user.profile);
  return res.status(StatusCodes.OK).json({ msg: "Job applied successfully" });
};

const fetchFilteredJob = async (req, res) => {
  const result = await fetchFilteredJobService(req.query);
  return res.status(StatusCodes.OK).json({ result: result });
};

module.exports = {
  uploadJob,
  updateJob,
  deleteJob,
  applyJob,
  fetchFilteredJob,
};
