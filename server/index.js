import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import cors package
import cookieParser from "cookie-parser";
import userRouter from "./Routes/User.Route.js";
import authRouter from "./Routes/Auth.Route.js";
import postRouter from "./Routes/Post.Route.js";
import commentRouter from "./Routes/Comment.Route.js";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected successfully!");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(express.json());

// Use cors middleware
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(cookieParser());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Expose-Headers", "Set-Cookie"); // Expose Set-Cookie header
//   next();
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000...!");
});

app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);
app.use("/server/post", postRouter);
app.use("/server/comment", commentRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
