var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var session = require("express-session");
var passport = require("passport");
var multer = require("multer");
const { v4: uuidv4 } = require("uuid");

//configure dotenv
require("dotenv").config();

//require('./routes/api/v1/googleProviderAuth');

//route files
var indexRoute = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//cors
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// passport session
const oneWeek = 1000 * 60 * 60 * 24 * 7;
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized: true,
    cookie: { maxAge: oneWeek },
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//the home route, the route with the api docs
app.use("/", indexRoute);

//load routes for api version 1
app.use("/api/v1/", require("./routes/api/v1/index"));
app.use("/api/v1/", require("./routes/api/v1/authRoutes"));

// if images are multiple process this route else just next()
app.use(
  "/api/v1/",
  require("./middlewares/processListingsImages").fields([
    { name: "img1" },
    { name: "img2" },
    { name: "img3" },
    { name: "img4" },
    { name: "img5" },
    { name: "video" },
    { name: "floorplan" },
  ]),
  require("./routes/api/v1/listingsRoutes")
);

// profile routes
app.use("/api/v1/", require("./routes/api/v1/profileRoutes"));

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
  res.status(err.status || 500).json({
    successful: false,
    status: "error",
    statusCode: err.status || 500,
    message: err.message,
    body: {},
    error: [err.stack],
  });
});

module.exports = app;
