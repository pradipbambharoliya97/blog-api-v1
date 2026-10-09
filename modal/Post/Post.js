const mongoose = require("mongoose");
const moment = require("moment");

// create schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Post category is required"],
    },
    numViews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    photo: {
      type: String,
      // required: [true, "Post Image is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

postSchema.pre(/^find/, function () {
  // add views count
  postSchema.virtual("commentCount").get(function () {
    return this.comments.length;
  });

  postSchema.virtual("viewsCount").get(function () {
    return this.numViews.length;
  });

  // add likes count
  postSchema.virtual("likesCount").get(function () {
    return this.likes.length;
  });

  // add dislikes count
  postSchema.virtual("disLikesCount").get(function () {
    return this.disLikes.length;
  });

  // add likes %
  postSchema.virtual("likesPercentage").get(function () {
    const total = +this.likes.length + +this.disLikes.length;
    return `${(+this.likes.length / total || 0) * 100}%`;
  });

  // add dislikes %
  postSchema.virtual("disLikesPercentage").get(function () {
    const total = +this.likes.length + +this.disLikes.length;
    return `${(+this.disLikes.length / total || 0) * 100}%`;
  });

  postSchema.virtual("daysAgo").get(function () {
    const postLastDate = moment(this?.createdAt).format("DD-MMM-yyyy");

    const diff = moment().diff(moment(postLastDate), "days");

    return `${diff} days ago`;
  });
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
