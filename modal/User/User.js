const mongoose = require("mongoose");
const moment = require("moment");
const Post = require("../Post/Post");

// create schema
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name is required"],
    },
    profilePhoto: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Editor"],
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    plan: {
      type: String,
      enum: ["Free", "Premium", "Pro"],
      default: "Free",
    },
    userAward: {
      type: String,
      enum: ["Bronze", "Silver", "Gold"],
      default: "Bronze",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// hooks

// pre - before record is saved
userSchema.pre("findOne", async function () {
  // populate the posts
  this.populate("posts");

  // get the user id
  const userId = this._conditions._id;

  // find the post created by the user
  const posts = await Post.find({ user: userId });

  const lastPost = posts[posts.length - 1];

  const lastPostDate = moment(lastPost?.createdAt).format("DD-MMM-yyyy");

  userSchema.virtual("lastPostdate").get(function () {
    return lastPostDate;
  });

  // check of the user is not active for 30 days

  const diff = moment().diff(moment(lastPostDate), "days");

  userSchema.virtual("isInactive").get(function () {
    return diff > 30;
  });
  await User.findByIdAndUpdate(
    userId,
    {
      isBlocked: diff > 30 || this.isBlocked,
    },
    {
      new: true,
    },
  );

  userSchema.virtual("lastActive").get(function () {
    if (diff <= 0) {
      return "Today";
    }
    if (diff === 1) {
      return "Yesterday";
    }
    if (diff > 1) {
      return `${diff} ago`;
    }
  });

  const numberOfPost = posts.length;
  await User.findByIdAndUpdate(
    userId,
    {
      userAward:
        numberOfPost < 10
          ? "Bronze"
          : numberOfPost > 10 || numberOfPost < 20
            ? "Silver"
            : "Gold",
    },
    {
      new: true,
    },
  );
});

// post - after saving
// userSchema.post("save", function (next) {
//   next();
// });

// get full name
userSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

// get initials
userSchema.virtual("initials").get(function () {
  return `${this.firstname[0]}${this.lastname[0]}`;
});

// get post count
userSchema.virtual("postCounts").get(function () {
  return this.posts.length;
});

// get following count
userSchema.virtual("followingCounts").get(function () {
  return this.following.length;
});

// get followers count
userSchema.virtual("followersCounts").get(function () {
  return this.followers.length;
});

// get viewrs count
userSchema.virtual("viewersCounts").get(function () {
  return this.viewers.length;
});

// get blocked count
userSchema.virtual("blockedCounts").get(function () {
  return this.blocked.length;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
