// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const projectName = "ironhack-project2";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const mainRouter = require("./routes/index");
app.use("/", mainRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

// Google 
/*
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL || "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Google account details:", profile);

      User.findOne({ googleID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({ googleID: profile.id })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);
*/

module.exports = app;
