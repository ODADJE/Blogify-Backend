const mongoose = require("mongoose");

// Schema

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    shares: {
      type: Number,
      default: 0,
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamp: true,
  }
);

// compile schema to model

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
