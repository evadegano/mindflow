const router = require("express").Router();
const mongoose = require("mongoose");
const axios = require("axios");
const SpotifyWebApi = require('spotify-web-api-node');

// Handles password encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

// database models
const User = require("../models/User.model");
const Goal = require("../models/Goal.model");
const Task = require("../models/Task.model");

// middleware to control access to specific routes
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

// GET /dashboard
router.get("/dashboard", (req, res, next) => {
  if (!req.session.user) return res.redirect('auth/login')

  // capitalize first letter of user's first name
  req.session.user.firstName = req.session.user.firstName[0].toUpperCase() + req.session.user.firstName.substring(1);

  // get the "zenQuote" object with the Zen Quote API
  const p1 = axios.get('https://zenquotes.io/api/today/');

  // search for the user's objectives in the database
  // goals filters 
  const p2 = Goal.find({ user_id: req.session.user._id, isDone: false });
  
  // search for the user's tasks in the database
  // today tasks filters
  const today = new Date().toISOString().split('T')[0]; // '2021-12-15'
  const todayTasksFilters = { user_id: req.session.user._id, endDate:  { $gte: new Date(`${today}T00:00:00.000Z`)  , $lte: new Date(`${today}T23:59:59.999Z`) }  , isDone: false };
  if (req.query.goal_id) {
    todayTasksFilters.goal_id = req.query.goal_id;
  }
  const p3 = Task.find(todayTasksFilters); //.populate('goal_id');
           
  // overdue tasks filters
  const overdueTasksFilters = { user_id: req.session.user._id, endDate: { $lt: new Date(`${today}T00:00:00.000Z`) }, isDone: false };
  if (req.query.goal_id) {
    overdueTasksFilters.goal_id = req.query.goal_id;
  }
  const p4 = Task.find(overdueTasksFilters);

  // get an "playlist" object with the Spotify API for the player widget : section problem solving
  const p5 = spotifyApi.getPlaylist('0zZHRFhDOuWJFKaD1W9Bto') // gamma brain waves

  // get an "playlist" object with the Spotify API for the player widget : section creativity
  const p6 = spotifyApi.getPlaylist('5XBZaWeBRk5QBL5BdI3D2A'); // alpha brain waves

  Promise.all([p1, p2, p3, p4, p5, p6])
    .then(function(values) {
      //console.log('values=', values)
      const [response, goalsFromDb, tasksFromDb, overdueTasksFromDb, gammaPlaylistData, alphaPlaylistData] = values;
      
      console.log('Playlist information', gammaPlaylistData.body);
      console.log('Tracks url',gammaPlaylistData.body.tracks.items);

      function getGoal(goalid) {
        return goalsFromDb.find(el => el.id === goalid)
      }
      tasksFromDb.forEach((task, i) => {
        const goal = getGoal(''+task.goal_id) // add a .goal property of the matching goal
        //console.log('goal=', goal)
        tasksFromDb[i].goal = goal
      })
      overdueTasksFromDb.forEach((task, i) => {
        const goal = getGoal(''+task.goal_id) 
        overdueTasksFromDb[i].goal = goal
      })
      // console.log('tasksFromDb=', tasksFromDb)
      // console.log('overdueTasksFromDb ==>', overdueTasksFromDb)

      //work's goals
      let workGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'work'
      })

      //health
      let healthGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'health'
      })

      //social
      let socialGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'social'
      })

      //finance
      let financeGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'finance'
      })

      //other
      let otherGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'other'
      })

      res.render('user/dashboard', {
        currentUser: req.session.user,
        zenQuote: response.data[0],
        workGoals: workGoals,
        healthGoals: healthGoals,
        socialGoals: socialGoals,
        financeGoals: financeGoals,
        otherGoals: otherGoals,
        allGoals: goalsFromDb,
        todayTasks: tasksFromDb,
        overdueTasks: overdueTasksFromDb,
        gammaPlaylist: gammaPlaylistData.body,
        gammaTracks: gammaPlaylistData.body.tracks.items,
        alphaPlaylist: alphaPlaylistData.body,
        alphaTracks: alphaPlaylistData.body.tracks.items,
      })
    })
    .catch(err => {
      next(err)
    })
})

// POST /dashboard

// POST /goals
// add a goal in the database
router.post("/goals", isLoggedIn, (req, res, next) => {
  Goal.create({ 
    user_id: req.session.user._id,
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    color: req.body.color,
    category: req.body.category
  })
    .then(newGoal => res.redirect('/user/dashboard'))
    .catch((err) => res.redirect('/user/dashboard'))
})

// update a goal in the database
router.post("/goals/:id/edit", isLoggedIn, (req, res, next) => {
  const { title, startDate, endDate, color } = req.body;
  const updateGoal = {};

  if (title !== "") {
    updateGoal.title = title;
  }
  if (startDate !== "") {
    updateGoal.endDate = endDate;
  }
  if (endDate !== "") {
    updateGoal.endDate = endDate;
  }
  if (color !== "") {
    updateGoal.color = color;
  }

  Goal.findByIdAndUpdate(req.params.id, updateGoal)
    .then(task => res.redirect('/user/dashboard'))
    .catch(err => {
      // console.log(err);
      res.redirect('/user/dashboard');    
    })
})

// delete a goal from the database
router.post("/goals/:id/delete", isLoggedIn, (req, res, next) => {
  Goal.findByIdAndRemove(req.params.id)
  .then(() => res.redirect('/user/dashboard'))
  .catch((err) => res.redirect('/user/dashboard'))
})


// POST /tasks
// add task in the database
router.post("/tasks", isLoggedIn, (req, res, next) => {
  Task.create({ 
    user_id: req.session.user._id,
    goal_id: req.body.taskGoal,
    title: req.body.title
  })
    .then(newTask => res.redirect('/user/dashboard'))
    .catch(err => res.redirect('/user/dashboard'))
})

//update a task in the database
router.post("/tasks/:id/edit", isLoggedIn, (req, res, next) => {
  const { title, endDate, taskGoal } = req.body;
  const updateTask = {};

  if (title !== "") {
    updateTask.title = title;
  }
  if (endDate !== "") {
    updateTask.endDate = endDate;
  }

  if (taskGoal !== "") {
    updateTask.goal_id = taskGoal;
  }

  Task.findByIdAndUpdate(req.params.id, updateTask)
    .then(task => res.redirect('/user/dashboard'))
    .catch(err => {
      // console.log(err);
      res.redirect('/user/dashboard');    
    })
})

router.post("/tasks/:id/done", isLoggedIn, (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, { isDone: req.body.isDone })
    .then(task => res.redirect('/user/dashboard'))
    .catch(err => {
      console.log(err);
      res.redirect('/user/dashboard');    
    })
})

//delete a task from the database
router.post("/tasks/:id/delete", isLoggedIn, (req, res, next) => {
  Goal.findByIdAndRemove(req.params.id)
  .then(() => res.redirect("/user/dashboard"))
  .catch((err) => res.redirect('/user/dashboard'))
})

// GET /profile
// display profile page
router.get("/profile", isLoggedIn, (req, res, next) => {
  // capitalize first letter of user's first name
  req.session.user.firstName = req.session.user.firstName[0].toUpperCase() + req.session.user.firstName.substring(1);
  
  res.render("user/profile", {
    currentUser: req.session.user
  });
})

// POST /profile
// update profile infos
router.post("/profile", isLoggedIn, (req, res, next) => {

  const { firstName, email, password, newPassword, newPasswordChecked } = req.body;
  const newUser = {};

  newUser.firstName = firstName;
  newUser.email = email;

  // make sure that the new password has the right format
  if (newPassword !== "") {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (!regex.test(newPassword)) {
      return res.status(400).render("user/profile", {
        errorMessage: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    }
  }

  // make sure that the new password is equal to the confirmation password
  if (newPassword !== "" && newPassword !== newPasswordChecked) {
    return res.status(400).render("user/profile", {
      errorMessage: "Confirmation password must match new password",
    });
  }

  if (password !== "" && newPassword !== "" && newPassword === newPasswordChecked) {
    const salt = bcrypt.genSaltSync(saltRounds);
    newUser.password = bcrypt.hashSync(newPassword, salt);
  }
  
  User.findOneAndUpdate({ _id: req.session.user._id }, newUser)
  .then(user => {
    req.session.user = user;
    console.log("update user ==>", req.session.user);
    res.redirect("/user/profile");
  })
  .catch((err) => {
    console.log(err);
    res.redirect('/user/profile');
  })
})

// Playlists Spotify

// Spotify API Setup
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// // Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

module.exports = router;