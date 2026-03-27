const Job = require("../models/job.model");
const User = require("../models/user.model");
const { checkRole } = require("../utils/utils");
const {
  fetchOrFail,
  deleteSuccessOrFail,
  buildValidQuery,
} = require("../helpers/assertions");
const CustomError = require("../error/customError");
const { StatusCodes } = require("http-status-codes");

const uploadJobService = async (body, userID) => {
  const user = await User.findOne({ _id: userID });
  if (!user.isVerified) {
    throw new CustomError(
      "Please verify your account",
      StatusCodes.UNAUTHORIZED,
    );
  }
  checkRole(user.role);
  const createdJob = await Job.create({ ...body, user: userID });
  fetchOrFail(
    createdJob,
    "Job creation failed. Please try again.",
    StatusCodes.BAD_REQUEST,
  );
  return createdJob;
};

const updateJobService = async (body, userID, jobID, role) => {
  const job = await Job.findOne({ _id: jobID });
  console.log(job.user, userID);
  fetchOrFail(job, "Job not found. Please try again.", StatusCodes.NOT_FOUND);

  checkRole(role);

  if (!job.user.equals(userID)) {
    throw new CustomError("You are not authorized.", StatusCodes.UNAUTHORIZED);
  }

  const updatedJob = await Job.updateOne(
    {
      _id: jobID,
    },
    { ...body },
  );
  if (!updatedJob.acknowledged) {
    throw new CustomError("Update failed", StatusCodes.BAD_REQUEST);
  }
  return;
};

const deleteJobService = async (userID, jobID) => {
  const job = await Job.findOneAndDelete({ user: userID, _id: jobID });
  deleteSuccessOrFail(
    job,
    "Delete failed. Please try again.",
    StatusCodes.BAD_REQUEST,
  );
  return;
};

const applyJobService = async (userID, jobID, profileID) => {
  const job = await Job.findOne({ _id: jobID });
  fetchOrFail(job, "Job not found. Please try again.", StatusCodes.NOT_FOUND);

  if (userID.equals(job.user)) {
    throw new CustomError(
      "Employer cannot apply for their own job.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const profileExists = job.applicants.some((applicant) =>
    applicant.equals(profileID),
  );

  if (profileExists) {
    throw new CustomError(
      "You already applied for this job.",
      StatusCodes.BAD_REQUEST,
    );
  }

  job.applicants.push(profileID);
  await job.save();
  return;
};

const fetchFilteredJobService = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  let validQuery = buildValidQuery(query);

  const operators = {
    minSalary: "$gte",
    maxSalary: "$lte",
  };

  const operatorKeys = Object.keys(operators);
  const exists = operatorKeys.some((key) => validQuery[key]);

  if (exists) {
    validQuery.yearSalary = {};
  }

  Object.entries(validQuery).forEach((obj) => {
    const [key, value] = obj;
    if (operators[key]) {
      validQuery.yearSalary[operators[key]] = Number(value);
      delete validQuery[key];
    }
  });

  const job = await Job.find({ ...validQuery })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
  fetchOrFail(job, "Job not found. Please try again.", StatusCodes.NOT_FOUND);
  return job;
};

module.exports = {
  uploadJobService,
  updateJobService,
  deleteJobService,
  applyJobService,
  fetchFilteredJobService,
};
