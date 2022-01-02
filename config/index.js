// get access to the body property in requests
const express = require("express");
// get messages in the terminal as requests are coming in
const logger = require("morgan");
// deal with cookies
const cookieParser = require("cookie-parser");
// serve a custom favicon on each request
const favicon = require("serve-favicon");
// allow flash messages
const flash = require("connect-flash");
// normalize paths amongst different operating systems
const path = require("path");
// session middleware for authentication
const session = require("express-session");
// package to save the user session in the database
const MongoStore = require("connect-mongo");


module.exports = (app) => {
  // app logs in a dev environment
  app.use(logger("dev"));

  // get access to the body property in requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // normalize the path to the views folder
  app.set("views", path.join(__dirname, "..", "views"));
  // set the view engine to handlebars
  app.set("view engine", "hbs");
  // handle access to the public folder
  app.use(express.static(path.join(__dirname, "..", "public")));

  // handle access to the favicon
  app.use(
    favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
  );

  // use flash messages
  app.use(flash());

  // use req.session for user sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super hyper secret key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
    })
  );
};
