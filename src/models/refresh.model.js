const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    ip: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      expires: 2592000,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Token", TokenSchema);
