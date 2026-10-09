const Post = require("../../modal/Post/Post");
const User = require("../../modal/User/User");
const { appError } = require("../../utils/appError");

exports.createPostsCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    const author = await User.findById(req.userAuth);

    if (author.isBlocked) {
      return next(appError("Access denied, Account blocked", 403));
    }

    const postCreated = await Post.create({
      title,
      description,
      user: author._id,
      category,
      photo: req?.file?.path || "",
    });

    author.posts.push(postCreated);

    await author.save();

    res.json({
      status: "success",
      data: postCreated,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.getAllPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.userAuth })
      .populate("user")
      .populate("category", "title");

    // check if the user is blocked by the post owner
    const filteredPost = posts.filter((post) => {
      const blockedUsers = post.user.blocked;
      const isBlocked = blockedUsers.includes(res.userAuth);
      return !isBlocked;
    });

    res.json({
      status: "success",
      data: filteredPost || [],
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.toggleLikePostsCtrl = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    const isLiked = post.likes.includes(req.userAuth);

    if (isLiked) {
      post.likes = post.likes.filter(
        (user) => user.toString() !== req.userAuth,
      );
    } else {
      post.likes.push(req.userAuth);
    }

    await post.save();

    res.json({
      status: "success",
      data: "Post like success",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.toggleDisLikePostsCtrl = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    const isdisLiked = post.disLikes.includes(req.userAuth);

    if (isdisLiked) {
      post.disLikes = post.disLikes.filter(
        (user) => user.toString() !== req.userAuth,
      );
    } else {
      post.disLikes.push(req.userAuth);
    }

    await post.save();

    res.json({
      status: "success",
      data: "Post dislike success",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.viewPostsCtrl = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    const userViewedAlready = post.numViews.includes(req.userAuth);

    if (!userViewedAlready) {
      post.numViews.push(req.userAuth);
      await post.save();
    }

    res.json({
      status: "success",
      data: post || "Post viewed",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.deletePostCtrl = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.userAuth) {
      return next(appError("You are not allow to delete this post", 403));
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: "post deleted successfully",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.userAuth) {
      return next(appError("You are not allow to update this post", 403));
    }

    await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        photo: req?.file?.path,
      },
      { new: true, runValidators: true },
    );

    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(appError(error.message));
  }
};
