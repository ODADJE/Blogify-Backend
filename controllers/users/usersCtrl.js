const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
const expressAsyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/sendEmail");

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

//@desc Block user
//@route POST /api/v1/users/block/:userIdToBlock
//access PRIVATE

exports.blockUser = asyncHandler(async (req, res) => {
  //* Find the user to be blocked
  const { userIdToBlock } = req.params;
  const userToBlock = await User.findById(userIdToBlock);
  if (!userToBlock) {
    throw new Error("User to block not found");
  }
  //!user who is blocking
  const userBlocking = req.userAuth._id;
  //check if user is blocking him/herself
  if (userIdToBlock.toString() === userBlocking.toString()) {
    throw new Error("Cannot block yourself");
  }
  //find the current user
  const currentUser = await User.findById(userBlocking);
  //? check if user already blocked
  if (currentUser?.blockedUsers?.includes(userIdToBlock)) {
    throw new Error("User already blocked");
  }
  //push the user to be blockes in the array of the current user
  currentUser?.blockedUsers.push(userIdToBlock);
  await currentUser.save();
  res.json({
    satus: "success",
    message: "User blocked succesfully",
  });
});

//@desc Unblock user
//@route POST /api/v1/users/unblock/:userIdToUnblock
//access PRIVATE

exports.unblockUser = asyncHandler(async (req, res) => {
  //* Find the user to be unblocked
  const { userIdToUnblock } = req.params;
  const userToBlock = await User.findById(userIdToUnblock);
  if (!userToBlock) {
    throw new Error("User to unblock not found");
  }
  //find the current user
  const userUnblocking = req.userAuth._id;
  const currentUser = await User.findById(userUnblocking);

  //check if user is blocked before unblocking
  if (!currentUser.blockedUsers.includes(userIdToUnblock)) {
    throw new Error("User not block");
  }
  //remove the user from the current user blocked users array
  currentUser.blockedUsers = currentUser.blockedUsers.filter(
    (id) => id.toString() !== userIdToUnblock.toString()
  );
  //resave the current user
  await currentUser.save();

  res.json({
    status: "success",
    message: "User unblocked succesfully",
  });
});

//@desc View my profile
//@route POST /api/v1/users/profile-viewer/:userProfileId
//access PRIVATE

exports.viewUserProfile = asyncHandler(async (req, res) => {
  //* Find the user we want to view the profile
  const { userProfileId } = req.params;
  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    throw new Error("User profile not found");
  }

  //find the current user
  const currentUserId = req.userAuth._id;
  //? check if user already viewed the profile
  if (userProfile?.profileViewers?.includes(currentUserId)) {
    throw new Error("Already seen the user profile");
  }
  //push the current user id into the user profile
  userProfile?.profileViewers.push(currentUserId);
  await userProfile.save();
  res.json({
    status: "success",
    message: "User profile viewed succesfully",
  });
});

//@desc following user
//@route POST /api/v1/users/following/:userToFollowId
//access PRIVATE

exports.followingUser = asyncHandler(async (req, res) => {
  //Find the current user
  const currentUserId = req.userAuth._id;
  //!Find the user to follow
  const { userToFollowId } = req.params;
  //Avoid user following himself
  if (currentUserId.toString() === userToFollowId.toString()) {
    throw new Error("You cannot folow yourserlf");
  }
  //Push the userToFollowId into the current user following field
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $addToSet: { following: userToFollowId },
    },
    {
      new: true,
    }
  );
  //Push the currentUserId into the user to follow followers field
  await User.findByIdAndUpdate(
    userToFollowId,
    {
      $addToSet: { followers: currentUserId },
    },
    {
      new: true,
    }
  );
  //send the response
  res.json({
    status: "success",
    message: "You followed the user succesfully",
  });
});

//@desc unfollowing user
//@route POST /api/v1/users/unfollowing/:userToUnfollowId
//access PRIVATE

exports.unfollowingUser = asyncHandler(async (req, res) => {
  //Find the current user
  const currentUserId = req.userAuth._id;
  //!Find the user to unfollow
  const { userToUnfollowId } = req.params;
  //Avoid user unfollowing himself
  if (currentUserId.toString() === userToUnfollowId.toString()) {
    throw new Error("You cannot unfollow yourserlf");
  }
  //Remove the userToUnfollowId into the current user following field
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: { following: userToUnfollowId },
    },
    {
      new: true,
    }
  );
  //Remove the currentUserId into the user to unfollow followers field
  await User.findByIdAndUpdate(
    userToUnfollowId,
    {
      $pull: { followers: currentUserId },
    },
    {
      new: true,
    }
  );
  //send the response
  res.json({
    status: "success",
    message: "You unfollowed the user succesfully",
  });
});

//@desc forgot password
//@route POST /api/v1/users/forgot-password
//access PUBLIC

exports.forgotPassword = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  //Find the email if our db
  const userFound = await User.findOne({ email });
  if (!userFound) {
    throw new Error("There's no Email in our system");
  }
  //Create token
  const resetToken = await userFound.generatePasswordResetToken();
  //resave the user
  await userFound.save();

  //send email
  sendEmail(email, resetToken);
  res.satus(200).json({ mesage: "Password reset email sent" });
});
