const express = require("express");
const isLoggin = require("../../middlewares/isLoggin");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("../../controllers/comments/comments");

const commentRouter = express.Router();

//create
commentRouter.post("/:postId", isLoggin, createComment);
//!delete
commentRouter.delete("/:id", isLoggin, deleteComment);
//*update
commentRouter.put("/:id", isLoggin, updateComment);

module.exports = commentRouter;
