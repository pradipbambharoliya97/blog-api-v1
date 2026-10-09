const express = require("express");
const {
  createPostsCtrl,
  deletePostCtrl,
  getAllPostsCtrl,
  updatePostCtrl,
  toggleLikePostsCtrl,
  toggleDisLikePostsCtrl,
  viewPostsCtrl,
} = require("../../controllers/posts/postsControllers");
const isLogin = require("../../middlewares/isLogin");
const multer = require("multer");
const storage = require("../../config/cloudinary");

const postsRouter = express.Router();

const upload = multer({ storage });

postsRouter.post("/", isLogin, upload.single("image"), createPostsCtrl);

postsRouter.get("/", isLogin, getAllPostsCtrl);

postsRouter.get("/like/:id", isLogin, toggleLikePostsCtrl);

postsRouter.get("/dislike/:id", isLogin, toggleDisLikePostsCtrl);

postsRouter.get("/view-post/:id", isLogin, viewPostsCtrl);

postsRouter.delete("/:id", isLogin, deletePostCtrl);

postsRouter.put("/:id", isLogin, updatePostCtrl);

module.exports = postsRouter;
