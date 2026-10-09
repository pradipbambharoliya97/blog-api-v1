const express = require("express");
const {
  userLoginCtrl,
  userProfileCtrl,
  getAllUsersCtrl,
  deleteUserCtrl,
  updateUserProfileCtrl,
  userRegisterCtrl,
  profilePhotoUploadCtrl,
  whoViewMyProfileCtrl,
  followingCtrl,
  unFollowCtrl,
  blockUsersCtrl,
  unBlockUsersCtrl,
  adminBlockUsersCtrl,
  adminUnBlockUsersCtrl,
  updateUserPasswordCtrl,
} = require("../../controllers/users/userControllers.js");
const isLogin = require("../../middlewares/isLogin.js");
const multer = require("multer");
const storage = require("../../config/cloudinary.js");
const isAdmin = require("../../middlewares/isAdmin.js");
const userRouter = express.Router();

// instance of multer
const upload = multer({ storage });

userRouter.post("/register", userRegisterCtrl);

userRouter.post("/login", userLoginCtrl);

userRouter.get("/profile", isLogin, userProfileCtrl);

userRouter.get("/", getAllUsersCtrl);

userRouter.delete("/", isLogin, deleteUserCtrl);

userRouter.put("/profile", isLogin, updateUserProfileCtrl);

userRouter.put("/update-profile-password", isLogin, updateUserPasswordCtrl);

userRouter.get("/profile-viewers/:id", isLogin, whoViewMyProfileCtrl);

userRouter.get("/following/:id", isLogin, followingCtrl);

userRouter.get("/unfollow/:id", isLogin, unFollowCtrl);

userRouter.get("/block/:id", isLogin, blockUsersCtrl);

userRouter.get("/unblock/:id", isLogin, unBlockUsersCtrl);

userRouter.put("/admin-block/:id", isLogin, isAdmin, adminBlockUsersCtrl);

userRouter.put("/admin-unblock/:id", isLogin, isAdmin, adminUnBlockUsersCtrl);

userRouter.post(
  "/profile-photo-upload",
  isLogin,
  upload.single("profile"),
  profilePhotoUploadCtrl,
);

module.exports = userRouter;
