const express = require("express");
const isLoggin = require("../../middlewares/isLoggin");
const {
  createPost,
  getPosts,
  deletePost,
  updatePost,
  getPost,
} = require("../../controllers/posts/posts");

const postRouter = express.Router();

//create
postRouter.post("/", isLoggin, createPost);
//?all
postRouter.get("/", getPosts);
//?single
postRouter.get("/:id", getPost);
//!delete
postRouter.delete("/:id", isLoggin, deletePost);
//*update
postRouter.put("/:id", isLoggin, updatePost);
module.exports = postRouter;
