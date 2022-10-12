const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 4,
    maxLength: 24,
  },

  pwd: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 8,
    maxLength: 24,
  },
});
UserSchema.pre("save", async function () {
  const salt = await bycrpt.genSalt(10);
  this.pwd = await bycrpt.hash(this.pwd, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, user: this.user },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bycrpt.compare(candidatePassword, this.pwd);
  return isMatch;
};
module.exports = mongoose.model("User", UserSchema);
