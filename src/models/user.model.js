const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "employer", "admin"],
      default: "user",
    },
    device: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    profile: {
      type: mongoose.Types.ObjectId,
      ref: "Profile",
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

module.exports = mongoose.model("User", UserSchema);
