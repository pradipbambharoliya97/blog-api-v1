const express = require("express");
const {
  createCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../../controllers/comments/commentsControllers");
const isLogin = require("../../middlewares/isLogin");

const commentsRoutes = express.Router();

commentsRoutes.post("/:id", isLogin, createCommentsCtrl);

commentsRoutes.delete("/:id", isLogin, deleteCommentCtrl);

commentsRoutes.put("/:id", isLogin, updateCommentCtrl);

module.exports = commentsRoutes;
