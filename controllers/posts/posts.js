const Post = require("../../model/Post/Post");
const asyncHandler = require("express-async-handler");
const User = require("../../model/User/User");
const Category = require("../../model/Category/Category");
//@desc Create a post
//@route POST /api/v1/posts
//@acces PRIVATE

exports.createPost = asyncHandler(async (req, res) => {
  //Get the payload
  const { title, image, content, categoryId } = req.body;
  //check if post exists
  const postFound = await Post.findOne({ title });
  if (postFound) {
    throw new Error("Post already exists");
  }
  //Create post
  const post = await Post.create({
    title,
    content,
    category: categoryId,
    image,
    author: req?.userAuth?._id,
  });
  //!Associate post to user
  await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  //*Push post into category
  await Category.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );
  //? send the response
  res.json({
    status: "succes",
    message: "Post succesfully created",
    post,
  });
});

//@desc Get all posts
//@route GET /api/v1/posts
//@acces PUBLIC

exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("comments");

  res.status(200).json({
    status: "success",
    message: "Posts successfully fetched ",
    posts,
  });
});

//@desc Get single post
//@route GET /api/v1/posts/:id
//@acces PUBLIC

exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Post successfully fetched ",
    post,
  });
});

//@desc Delete post
//@route DELETE /api/v1/posts/:id
//@acces PRIVATE

exports.deletePost = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Post successfully deleted ",
  });
});

//@desc Update post
//@route PUT /api/v1/posts/:id
//@acces PRIVATE

exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Post successfully updated ",
    post,
  });
});
