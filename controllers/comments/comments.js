const Comment = require("../../model/Comment/Comment");
const asyncHandler = require("express-async-handler");
const Post = require("../../model/Post/Post");

//@desc Create a comment
//@route POST /api/v1/comments/:postId
//@acces PRIVATE
exports.createComment = asyncHandler(async (req, res) => {
  //get the payload
  const { message } = req.body;
  const { postId } = req.params;
  //* Create comment
  const comment = await Comment.create({
    message,
    author: req.userAuth._id,
    postId,
  });
  //Associate comment to a post
  await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment._id },
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "Comment created succesfully",
    comment,
  });
});

//@desc Delete comment
//@route DELETE /api/v1/comments/:id
//@acces PRIVATE

exports.deleteComment = asyncHandler(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Comment successfully deleted ",
  });
});

//@desc Update comment
//@route PUT /api/v1/comments/:id
//@acces PRIVATE

exports.updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      message: req.body.message,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Comment successfully updated ",
    comment,
  });
});
