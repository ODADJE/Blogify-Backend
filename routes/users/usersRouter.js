const express = require("express");

const {
  register,
  login,
  getProfile,
} = require("../../controllers/users/usersCtrl");
const isLoggin = require("../../middlewares/isLoggin");

const usersRouter = express.Router();

//!Register
usersRouter.post("/register", register);
//Login
usersRouter.post("/login", login);
//profile
usersRouter.get("/profile", isLoggin, getProfile);

// * Export
module.exports = usersRouter;
