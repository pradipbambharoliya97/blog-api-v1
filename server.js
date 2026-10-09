const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/users/userRoutes");
const postsRouter = require("./routes/posts/postsRoutes");
const commentsRoutes = require("./routes/comments/commentsRoutes");
const categoriesRoutes = require("./routes/categories/categoriesRoutes");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const Post = require("./modal/Post/Post");

require("dotenv").config();
require("./config/dbConnect");

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "https://blog-api-v1-uy97.onrender.com",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman) or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

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
