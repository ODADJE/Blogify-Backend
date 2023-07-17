const mongoose = require("mongoose");

// Schema

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    postsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

// compile schema to model

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
