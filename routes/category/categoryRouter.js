const express = require("express");
const isLoggin = require("../../middlewares/isLoggin");
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categories/category");

const categoryRouter = express.Router();

//create
categoryRouter.post("/", isLoggin, createCategory);
//?all
categoryRouter.get("/", getCategories);
//!delete
categoryRouter.delete("/:id", isLoggin, deleteCategory);
//*update
categoryRouter.put("/:id", isLoggin, updateCategory);

module.exports = categoryRouter;
