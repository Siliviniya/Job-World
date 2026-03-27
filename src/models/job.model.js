const mongoose = require("mongoose");

const ApplicantSchema = new mongoose.Schema({
  profile: { type: mongoose.Types.ObjectId, ref: "Profile" },
});

const JobSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true,
    },
    yearSalary: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    workType: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    applicants: {
      type: [ApplicantSchema],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", JobSchema);
