const User = require("../../modal/User/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");
const { appError } = require("../../utils/appError");
const Post = require("../../modal/Post/Post");
const Comment = require("../../modal/Comment/Comment");
const Category = require("../../modal/Category/Category");

exports.userRegisterCtrl = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    // check if email exist
    const userFound = await User.findOne({ email });

    if (userFound) {
      return next(appError("User already exist", 409));
    }
    // hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create the user
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.userLoginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // check the if email exist
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return next(appError("Invalid login credential"));
    }

    // verify the password
    const isPasswordMatch = await bcrypt.compare(password, userFound.password);

    if (!isPasswordMatch) {
      return next(appError("Invalid login credential"));
    }

    // validity of the password

    res.json({
      status: "success",
      data: {
        _id: userFound._id,
        firstname: userFound.firstname,
        lastname: userFound.lastname,
        email: userFound.email,
        isAdmin: userFound.isAdmin,
        token: generateToken(userFound._id),
      },
    });
  } catch (error) {
    next(appError("Invalid login credential"));
  }
};

exports.whoViewMyProfileCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const userWhoViewed = await User.findById(req.userAuth);

    if (user && userWhoViewed) {
      const isUserAlreadyViewed = user.viewers.find(
        (viewer) => viewer.toString() === userWhoViewed._id.toJSON(),
      );

      if (isUserAlreadyViewed) {
        return next(appError("You already viewed this profile"));
      } else {
        user.viewers.push(userWhoViewed._id);

        // save the user
        await user.save();

        res.json({
          status: "You successfully viewed this profile",
          data: user,
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

exports.followingCtrl = async (req, res, next) => {
  try {
    // find user to follow
    const userToFollow = await User.findById(req.params.id);

    // find user who is following
    const userWhoFollowed = await User.findById(req.userAuth);

    // check if user and user who floowed are found
    if (userToFollow && userWhoFollowed) {
      // check if user who followed is already in the array
      const isUserAlreadyFollowed = userWhoFollowed.following.find(
        (follower) => follower.toString() === userToFollow._id.toJSON(),
      );

      if (isUserAlreadyFollowed) {
        return next(appError("you already follow this user"));
      } else {
        userToFollow.followers.push(userWhoFollowed._id);
        userWhoFollowed.following.push(userToFollow._id);

        // save the user
        await userWhoFollowed.save();
        await userToFollow.save();

        res.json({
          status: "success",
          data: "You successfully following this profile",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

exports.unFollowCtrl = async (req, res, next) => {
  try {
    const userToUnFollow = await User.findById(req.params.id);

    const userWhoUnFollowed = await User.findById(req.userAuth);

    if (userToUnFollow && userWhoUnFollowed) {
      const isUserAlreadyUnFollowed = userToUnFollow.followers.find(
        (follower) => follower.toString() === userWhoUnFollowed._id.toJSON(),
      );

      if (isUserAlreadyUnFollowed) {
        userToUnFollow.followers = userToUnFollow.followers.filter(
          (user) => user.toString() !== userWhoUnFollowed._id.toJSON(),
        );
        await userToUnFollow.save();

        userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
          (user) => user.toString() !== userToUnFollow._id.toJSON(),
        );

        // save the user
        await userWhoUnFollowed.save();

        res.json({
          status: "success",
          data: `You succesfully unfollow to ${userToUnFollow.firstname}`,
        });
      } else {
        next(appError("you already not following this user"));
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

exports.userProfileCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.userAuth);
    if (!user) {
      return res.json({
        status: "success",
        data: "User not found",
      });
    }

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.blockUsersCtrl = async (req, res, next) => {
  try {
    const userToBlock = await User.findById(req.params.id);

    const userWhoBlockeded = await User.findById(req.userAuth);

    if (userToBlock && userWhoBlockeded) {
      const isUserAlreadyBlocked = userWhoBlockeded.blocked.find(
        (user) => user.toString() === userToBlock._id.toJSON(),
      );

      if (isUserAlreadyBlocked) {
        return next(appError(`you already blocked ${userToBlock.firstname}`));
      } else {
        userWhoBlockeded.blocked.push(userToBlock._id);

        await userWhoBlockeded.save();

        res.json({
          status: "success",
          data: `You successfully block ${userToBlock.firstname}`,
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

exports.unBlockUsersCtrl = async (req, res, next) => {
  try {
    const userToUnBlock = await User.findById(req.params.id);

    const userWhoUnBlocked = await User.findById(req.userAuth);

    if (userToUnBlock && userWhoUnBlocked) {
      const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
        (user) => user.toString() === userToUnBlock._id.toJSON(),
      );

      if (isUserAlreadyBlocked) {
        userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
          (user) => user.toString() !== userToUnBlock._id.toJSON(),
        );

        await userWhoUnBlocked.save();

        res.json({
          status: "success",
          data: `You successfully unblock ${userToUnBlock.firstname}`,
        });
      } else {
        return next(
          appError(`you already unblocked ${userToUnBlock.firstname}`),
        );
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

exports.adminBlockUsersCtrl = async (req, res, next) => {
  try {
    const userToBlock = await User.findById(req.params.id);

    if (userToBlock) {
      if (userToBlock.isBlocked) {
        return next(appError(`${userToBlock.firstname} is already blocked`));
      }

      userToBlock.isBlocked = true;

      await userToBlock.save();

      res.json({
        status: "success",
        data: `You successfully block ${userToBlock.firstname}`,
      });
    }
  } catch (error) {
    next(appError(error.message));
  }
};

exports.adminUnBlockUsersCtrl = async (req, res, next) => {
  try {
    const userToUnBlock = await User.findById(req.params.id);

    if (userToUnBlock) {
      if (!userToUnBlock.isBlocked) {
        return next(
          appError(`${userToUnBlock.firstname} is already unblocked`),
        );
      }

      userToUnBlock.isBlocked = false;

      await userToUnBlock.save();

      res.json({
        status: "success",
        data: `You successfully unblock ${userToUnBlock.firstname}`,
      });
    }
  } catch (error) {
    next(appError(error.message));
  }
};

exports.getAllUsersCtrl = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.deleteUserCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.userAuth);

    if (!user) {
      return next(appError("User not found", 400));
    }

    await Post.deleteMany({ user: user._id });
    await Comment.deleteMany({ user: user._id });
    await Category.deleteMany({ user: user._id });
    await User.deleteOne({ _id: req.userAuth });

    res.json({
      status: "success",
      data: "profile deleted successfully",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.updateUserProfileCtrl = async (req, res, next) => {
  const { email, firstname, lastname } = req.body;
  try {
    // check if email is not taken alredy by other
    if (email) {
      const emailTaken = await User.findOne({ email });

      if (emailTaken) {
        return next(appError("Email is taken", 400));
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userAuth,
      {
        email,
        firstname,
        lastname,
      },
      { new: true, runValidators: true },
    );

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.updateUserPasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.userAuth);

    if (!user) {
      return next(appError("User not found", 400));
    }

    if (!password) {
      return next(appError("Passowrd require", 400));
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    await user.save();

    res.json({
      status: "success",
      data: "profile password updated successfully",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.profilePhotoUploadCtrl = async (req, res, next) => {
  try {
    // find the user
    const usertoUpdate = await User.findById(req.userAuth);

    // check if the user is found
    if (!usertoUpdate) {
      return next(appError("User not found", 403));
    }

    // check the user is blocked or not
    if (usertoUpdate.isBlocked) {
      return next(appError("Action not allowed, Your account is blocked", 403));
    }

    // check if user is updating their profile photo
    if (req.file) {
      // update the profile photo
      await User.findByIdAndUpdate(
        req.userAuth,
        {
          $set: {
            profilePhoto: req.file.path,
          },
        },
        {
          new: true,
        },
      );
      res.json({
        status: "success",
        data: "Profile photo updated successfully",
      });
    }
  } catch (error) {
    next(appError(error.message));
  }
};
