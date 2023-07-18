const express = require("express");

const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  viewUserProfile,
  followingUser,
  unfollowingUser,
} = require("../../controllers/users/usersCtrl");
const isLoggin = require("../../middlewares/isLoggin");

const usersRouter = express.Router();

//!Register
usersRouter.post("/register", register);
//Login
usersRouter.post("/login", login);
//profile
usersRouter.get("/profile", isLoggin, getProfile);
//block user
usersRouter.put("/block/:userIdToBlock", isLoggin, blockUser);
//unblock user
usersRouter.put("/unblock/:userIdToUnblock", isLoggin, unblockUser);
//view user
usersRouter.get("/profile-viewer/:userProfileId", isLoggin, viewUserProfile);
//user follwing
usersRouter.put("/following/:userToFollowId", isLoggin, followingUser);
//user unfollwing
usersRouter.put("/unfollowing/:userToUnfollowId", isLoggin, unfollowingUser);

// * Export
module.exports = usersRouter;
