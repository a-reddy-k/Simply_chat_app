var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const socketIo = require("socket.io");
const http = require("http");
require("dotenv").config();

var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
var signUpRouter = require("./routes/signUp");
var ChatsRouter = require("./routes/chats");
// var allUsersRouter = require('./routes/allUsers');
const connectDB = require("./db");
const bodyParser = require("body-parser");
// var messageRouter = require('./routes/messages');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

connectDB();

app.use(express.json());

app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/signup", signUpRouter);
app.use("/chats", ChatsRouter);
// app.use('/messages', messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
// module.exports = io;
