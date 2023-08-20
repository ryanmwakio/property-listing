var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');
var passport = require('passport');
var multer = require('multer');
const { v4: uuidv4 } = require('uuid');

//multer filters and config
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/profiles/');
  },
  filename: (req, file, cb) => {
    let fileUniqueName = uuidv4();
    //get extension
    let extensionArray = file.originalname.split('.');
    let extension = extensionArray[extensionArray.length - 1];

    let imgName = fileUniqueName + '-' + path.extname(file.originalname);
    // get the path to file with the hostname

    cb(null, imgName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
//multer filters and config end

module.exports = upload;
