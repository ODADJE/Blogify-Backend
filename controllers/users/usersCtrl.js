const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");

//@desc Register a new user
//@route POST /api/v1/users/register
//access public

exports.register = asyncHandler(async (req, res) => {
  // get the details
  const { username, password, email } = req.body;
  //! Check if user exists
  const user = await User.findOne({ username });
  if (user) {
    throw new Error("User already exists");
  }

  //Register new user
  const newUser = new User({
    username,
    email,
    password,
  });

  //!hash password
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);

  //save
  await newUser.save();

  res.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    _id: newUser?._id,
    username: newUser?.username,
    email: newUser?.email,
    role: newUser?.role,
  });
});
//@desc Login a new user
//@route POST /api/v1/users/login
//access public

exports.login = asyncHandler(async (req, res) => {
  //?get the login details
  const { username, password } = req.body;

  //! Check if exists
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  //compare the hashed password with the one request
  const isMatched = await bcrypt.compare(password, user?.password);

  if (!isMatched) {
    throw new Error("invalid login credentials");
  }

  //Update the last login
  user.lastLogin = new Date();
  await user.save();
  res.json({
    status: "succes",
    _id: user?._id,
    username: user?.username,
    email: user?.email,
    role: user?.role,
    token: generateToken(user),
  });
});

//@desc Get profile
//@route Post /api/v1/users/profile/:id
//access Private

exports.getProfile = asyncHandler(async (req, res, next) => {
  //! get user id from params
  const { id } = req.userAuth.id;
  const user = await User.findById(id);
  res.json({
    status: "success",
    message: "Profile fetched",
    data: req.userAuth,
  });
});
