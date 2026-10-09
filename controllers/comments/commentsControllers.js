const Comment = require("../../modal/Comment/Comment");
const Post = require("../../modal/Post/Post");
const { appError } = require("../../utils/appError");

exports.createCommentsCtrl = async (req, res, next) => {
  const { description } = req.body;
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      next(appError("Post not found", 403));
    }

    const comment = await Comment.create({
      user: req.userAuth,
      post: post._id,
      description,
    });

    post.comments.push(comment._id);

    await post.save({ validateBeforeSave: false });

    res.json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.deleteCommentCtrl = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(appError("Comment not found", 403));
    }
    if (comment.user !== req.userAuth) {
      return next(appError("You are not allow to delete this comment", 403));
    }

    const post = await Post.findById(comment.post);

    if (!post) {
      next(appError("Post not found", 403));
    }

    post.comments = post.comments.filter(
      (p) => p.toString() !== comment._id.toString(),
    );

    await post.save();

    await Comment.findByIdAndDelete(comment._id);

    res.json({
      status: "success",
      data: "comments deleted successfully",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.updateCommentCtrl = async (req, res, next) => {
  const { description } = req.body;
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(appError("Comment not found", 403));
    }

    if (comment?.user !== req.userAuth) {
      return next(appError("You are not allow to update this comment", 403));
    }
    await Comment.findByIdAndUpdate(
      req.params.id,
      { description },
      { new: true, runValidators: true },
    );

    res.json({
      status: "success",
      data: "comment updated successfully",
    });
  } catch (error) {
    next(appError(error.message));
  }
};
