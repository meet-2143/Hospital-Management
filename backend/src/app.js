const express = require('express');
const helmet = require('helmet');

var bodyParser = require('body-parser');
var app = express();
var path = require('path');
app.use(bodyParser.json());
const config = require('./config');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet.frameguard());
app.use(helmet.hsts({ maxAge: 5184000 }));
app.use(helmet.noSniff())
/* 
var fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: config.awsFileUploadLimit * 1024 * 1024 },
})); */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));
app.use('/public/doctor', express.static('public/doctor'));
// app.use('/public/images/users/profiles', express.static('public/images/users/profiles'));
// app.use('/public/images/users/aadhar', express.static('public/images/users/aadhar'));
// app.use('/public/images/users/astro', express.static('public/images/users/astro'));
// app.use('/public/images/users/pan', express.static('public/images/users/pan'));
// app.use('/public/images/users/story', express.static('public/images/users/story'));
// app.use('/public/images/users/gallery', express.static('public/images/users/gallery'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token, devicetype, countrycode, timezoneoffset');
  res.header('Access-Control-Expose-Headers', 'x-access-token, Authorization');
  if (req.method === "OPTIONS") {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    return res.status(200).json({});
  }
  process.on('uncaughtException', function (err) {
    console.log("Main error: ", err)
  });
  next();
});

/**
 * Routes
 */
var users = require('./routes/users');


app.use('/user', users);


module.exports = app;