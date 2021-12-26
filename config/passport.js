// package to manage auth strategies
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");
const bcrypt = require("bcrypt");


module.exports = passport => {
  // init passport strategies
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      (username, password, done) => {
        // search for user in database
        console.log("user search init")
        User.findOne({ email: username })
          .then(user => {
            // return error if email adress doesn't exist in the database
            if (!user) {
              console.log("user not found ===> error")
              return done(null, false, {
                errorMessage: "Incorrect email address."
              });
            }

            if (!bcrypt.compareSync(password, user.password)) {
              console.log("user found ===> wrong pwd")
              return done(null, false, {
                errorMessage: "Incorrect password."
              })
            }
            console.log("user found ===> ok")
            done(null, user);
          })
          .catch(err => {
            console.log("ERROR")
            done(err)});
      }
    )
  )

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH_ID,
        clientSecret: process.env.GOOGLE_OAUTH_SECRET,
        callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL || "/auth/google/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("Google account details: ", profile);

        // search for user in database
        User.findOne({ googleID: profile.id })
          .then(user => {
            console.log("google user search init")
            // log in user if found
            if (user) {
              console.log("google user found in db => logging in")
              done(null, user);
              return;
            }

            console.log("google user not found in db => signing up")

            // add user to database if not found
            User.create({ 
              firstName: profile.name.givenName,
              email: profile.emails.value,
              googleID: profile.id
            })
              .then(newUser => {
                done(null, newUser);
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      }
    )
  )

  // serialize user to define what data will be kept in the session
  passport.serializeUser((user, cb) => cb(null, user._id));
  passport.deserializeUser((id, cb) => {
    User.findById(id)
      .then(user => cb(null, user))
      .catch(err => cb(err));
  })
}

