const express = require("express");
const {
  createCategoriesCtrl,
  deleteCategoriesCtrl,
  updateCategoriesCtrl,
  categoryDetailsCtrl,
  getAllCategoriesCtrl,
} = require("../../controllers/categories/categoriesControllers");
const isLogin = require("../../middlewares/isLogin");

const categoriesRoutes = express.Router();

categoriesRoutes.post("/", isLogin, createCategoriesCtrl);

categoriesRoutes.get("/", isLogin, getAllCategoriesCtrl);

categoriesRoutes.get("/:id", isLogin, categoryDetailsCtrl);

categoriesRoutes.delete("/:id", isLogin, deleteCategoriesCtrl);

categoriesRoutes.put("/:id", isLogin, updateCategoriesCtrl);

module.exports = categoriesRoutes;
