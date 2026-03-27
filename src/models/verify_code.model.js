const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema(
  {
    verificationCode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, expires: 180 },
);

module.exports = mongoose.model("VerificationCode", CodeSchema);
