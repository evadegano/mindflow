// get access to environment variables
require("dotenv/config");
// connect to the database
require("./db");
// handle http requests
const express = require("express");
// handle authentification strategies
const passport = require('passport');
// handle dynamic views
const hbs = require("hbs");


// init app
const app = express();

// set up project variables
const projectName = "ironhack-project2";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();
app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// import app middlewares
require("./config/index")(app);
// set path to partials
hbs.registerPartials(__dirname + "/views/partials/" );

// import passport middlewares
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// import routes
const mainRouter = require("./routes/index");
app.use("/", mainRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const recoveryRouter = require("./routes/recovery");
app.use("/recovery", recoveryRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

// handle errors
require("./error-handling")(app);


module.exports = app;
