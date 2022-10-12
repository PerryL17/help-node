const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  console.log("register functions");
  const user = await User.create({ ...req.body });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    throw new BadRequestError("Please provide username and password");
  }
  const username = await User.findOne({ user });
  if (!username) {
    throw new UnauthenticatedError("Invaild Credentials");
  }
  //compare password
  const isPasswordCorrect = await user.comparePassword(pwd);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invaild Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
