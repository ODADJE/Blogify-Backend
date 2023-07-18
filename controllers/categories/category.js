const Category = require("../../model/Category/Category");
const asyncHandler = require("express-async-handler");

//@desc Create a category
//@route POST /api/v1/categories
//@acces PRIVATE

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, author } = req.body;

  //! if exist
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category already exists");
  }
  const category = await Category.create({
    name,
    author: req.userAuth?._id,
  });
  res.status(201).json({
    status: "success",
    message: "Category successfully created ",
    category,
  });
});

//@desc Get all categories
//@route GET /api/v1/categories
//@acces PUBLIC

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  res.status(200).json({
    status: "success",
    message: "Categories successfully fetched ",
    categories,
  });
});

//@desc Delete category
//@route DELETE /api/v1/categories/:id
//@acces PRIVATE

exports.deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Categories successfully deleted ",
  });
});

//@desc Update category
//@route PUT /api/v1/categories/:id
//@acces PRIVATE

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Categories successfully updated ",
    category,
  });
});
