const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    selfDescription: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    career: {
      type: String,
      required: true,
      maxlength: 500,
    },
    education: {
      type: String,
      required: true,
      maxlength: 100,
    },
    image: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", ProfileSchema);
