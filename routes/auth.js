const router = require("express").Router();
const passport = require("passport");

// database connection and models
const mongoose = require("mongoose");
const User = require("../models/User.model");

// password encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

// middlewares to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");

// GET sign up route
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

// POST sign up route
router.post("/signup", (req, res, next) => {
  const { firstName, email, password, passwordCheck } = req.body;

  // make sure all fields are filled in
  if (!firstName || !email || !password || !passwordCheck) {
    return res
      .status(400)
      .render("auth/signup", { 
        errorMessage: "All fields are mandatory. Please provide your firstName, email and password."
      });
  }

  // make sure that both passwords are equal
  if (password !== passwordCheck) {
    return res
      .status(400)
      .render("auth/signup", { 
        errorMessage: "Your password and confirmation password must match."
      });
  }

  // check for password's strength
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  if (!pwdRegex.test(password)) {
    return res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Passwords must have at least 8 characters and include at least one lowercase and one uppercase letter, one number and one special character."
      });
  }

  // make sure the email address is valid
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Please provide a valid email address."
      });
  }

  // search the database for a user with the email submitted in the form
  User.findOne({ email }).then((user) => {
    // return an error message if this email address is already in the database
    if (user) {
      return res
        .status(400)
        .render("auth/signup", { 
          errorMessage: "This email address is already linked to an account." 
        });
    }

    // else, add user to the database
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // create a user and save it in the database
        return User.create({
          firstName,
          email,
          password: hashedPassword,
        });
      })
      .then((user) => {
        // bind the user to the session object
        req.user = user;
        res.redirect("/user/dashboard");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { 
              errorMessage: error.message 
            });
        }
        if (error.code === 11000) {
          return res
            .status(400)
            .render("auth/signup", {
              errorMessage: "Email needs to be unique. The email you chose is already in use.",
            });
        }
        return res
          .status(500)
          .render("auth/signup", { 
            errorMessage: error.message 
          });
      });
  });
});

// get log in route
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login", {
    errorMessage: req.flash("error")
  });
})


// post log in route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/user/dashboard",
  failureRedirect: "/auth/login",
  failureFlash: true
  })
)


// get Google route
router.get("/google", passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
}))


// get Google callback route
router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/user/dashboard",
  failureRedirect: "/auth/login",
  failureFlash: true
}))


// post logout route
router.post("/logout", (req, res, next) => {
  // terminate user session
  req.logout();
  // send user back to homepage
  res.redirect("/");
})


module.exports = router;
