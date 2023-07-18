const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const express = require("express");
const usersRouter = require("./routes/users/usersRouter");
const {
  notFound,
  globalErrorHandler,
} = require("./middlewares/globalErrorHandler");
const categoryRouter = require("./routes/category/categoryRouter");
const postRouter = require("./routes/post/postRouter");
const commentRouter = require("./routes/comment/commentRouter");
const sendEmail = require("./utils/sendEmail");

//!Server
const app = express();

//db connect
require("./config/database")();

//send reset passwoed mail
//sendEmail("odadjek16@gmail.com", "djdjdjd");
//Middlewares
app.use(express.json()); //Pass incoming data

// Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

//? Not Found middleware
app.use(notFound);

//! Error middleware
app.use(globalErrorHandler);

const server = http.createServer(app);
//? Start the server
const PORT = process.env.PORT || 9080;
server.listen(PORT, console.log(`Server is running on port ${PORT}`));
