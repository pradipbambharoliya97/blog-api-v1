const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/users/userRoutes");
const postsRouter = require("./routes/posts/postsRoutes");
const commentsRoutes = require("./routes/comments/commentsRoutes");
const categoriesRoutes = require("./routes/categories/categoriesRoutes");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const Post = require("./modal/Post/Post");
const corsOptions = require("./utils/corsOptions");

require("dotenv").config();
require("./config/dbConnect");

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

// middlewares

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();

    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    res.json(error.message);
  }
});

// routes
// // ----- users route
app.use("/api/v1/users", userRouter);
// // ----- posts route
app.use("/api/v1/posts", postsRouter);
// // ----- comments route
app.use("/api/v1/comments", commentsRoutes);
// // ----- categories route
app.use("/api/v1/categories", categoriesRoutes);

// Error handlers middleware
app.use(globalErrorHandler);

// 404 error

app.all("{*splat}", (req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

// Listen to server

const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log("Server connected"));
