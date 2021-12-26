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
const isLoggedIn = require("../middleware/isLoggedIn");

// GET sign up route
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST sign up route
router.post("/signup", isLoggedOut, (req, res) => {
  const { firstName, email, password } = req.body;

  // if (!firstName) {
  //   return res
  //     .status(400)
  //     .render("auth/signup", { nameErrorMessage: "Please provide your first name" });
  // }

  // if (!email) {
  //   return res
  //     .status(400)
  //     .render("auth/signup", { emailErrorMessage: "Please provide your email." });
  // }

  // if (password.length < 8) {
  //   return res.status(400).render("auth/signup", {
  //     passwordErrorMessage: "Your password needs to be at least 8 characters long.",
  //   });
  // }

  if (!firstName || !email || password.length < 8) {
    res.render('auth/signup', { 
      errorMessage: ` ⚠️  All fields are mandatory. Please provide your firstName, email and password. 
      Your password must contain at least 8 or more characters.` });
    return;
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the username submitted in the form
  User.findOne({ email }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Email already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          firstName,
          email,
          password: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        console.log("user ==>", req.session.user)
        res.redirect("/user/dashboard");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Email needs to be unique. The email you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

// get log in route
router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    errorMessage: req.flash("error")
  });
})


// post log in route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/private/join-chat",
  failureRedirect: "/auth/login",
  failureFlash: true
  })
)

/*
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  // if (!email) {
  //   return res
  //     .status(400)
  //     .render("auth/login", { errorMessage: "Please provide your email." });
  // }

  // // Here we use the same logic as above
  // // - either length based parameters or we check the strength of a password
  // if (password.length < 8) {
  //   return res.status(400).render("auth/login", {
  //     errorMessage: "Your password needs to be at least 8 characters long.",
  //   });
  // }

  if (!email || !password) {
    res.render('auth/login', { 
      errorMessage: ` ⚠️  All fields are mandatory. Please provide your email and password.` });
    return;
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }
        req.session.user = user;
        console.log("user ==>", req.session.user);

        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/user/dashboard");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.post("/logout", isLoggedIn, (req, res) => {
  // destroy user session
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("user/dasboard", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});
*/

// get Google route
router.get("/google", passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
}))

// get Google callback route
router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/private/join-chat",
  failureRedirect: "/auth/login"
}))

// post logout route
router.post("/logout", (req, res, next) => {
  // terminate user session
  req.logout();
  // send user back to homepage
  res.redirect("/");
})


module.exports = router;
