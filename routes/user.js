const router = require("express").Router();
const axios = require("axios");
const SpotifyWebApi = require('spotify-web-api-node');

// password encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

// database models
const User = require("../models/User.model");
const Goal = require("../models/Goal.model");
const Task = require("../models/Task.model");

// middlewares to control access to specific routes
const isAuthenticated = require("../middleware/isAuthenticated");

// Spotify API Setup
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});




// GET /dashboard
router.get("/dashboard", isAuthenticated, (req, res, next) => {
  // capitalize first letter of user's first name
  let capitalizedUserName = req.user.firstName[0].toUpperCase() + req.user.firstName.substring(1);

  // Retrieve an access token
  spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  // get the "zenQuote" object with the Zen Quote API
  const p1 = axios.get('https://zenquotes.io/api/today/');

  // search for the user's objectives in the database
  // goals filters 
  const p2 = Goal.find({ user_id: req.user._id, isDone: false });
  
  // search for the user's tasks in the database
  // today tasks filters
  const today = new Date().toISOString().split('T')[0]; // '2021-12-15'
  const todayTasksFilters = { user_id: req.user._id, endDate:  { $gte: new Date(`${today}T00:00:00.000Z`)  , $lte: new Date(`${today}T23:59:59.999Z`) }  , isDone: false };
  
  if (req.query.goal_id) {
    todayTasksFilters.goal_id = req.query.goal_id;
  }

  const p3 = Task.find(todayTasksFilters); //.populate('goal_id');
           
  // overdue tasks filters
  const overdueTasksFilters = { user_id: req.user._id, endDate: { $lt: new Date(`${today}T00:00:00.000Z`) }, isDone: false };
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
      const [ response, goalsFromDb, tasksFromDb, overdueTasksFromDb, gammaPlaylistData, alphaPlaylistData ] = values;

      function getGoal(goalid) {
        return goalsFromDb.find(el => el.id === goalid)
      }

      tasksFromDb.forEach((task, i) => {
        const goal = getGoal(''+task.goal_id)
        tasksFromDb[i].goal = goal
      })

      overdueTasksFromDb.forEach((task, i) => {
        const goal = getGoal(''+task.goal_id) 
        overdueTasksFromDb[i].goal = goal
      })

      // work goals
      let workGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'work'
      })

      // health goals
      let healthGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'health'
      })

      // social goals
      let socialGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'social'
      })

      // finance goals
      let financeGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'finance'
      })

      // other goals
      let otherGoals = goalsFromDb.filter(function(goal) {
        return goal.category === 'other'
      })

      // all goals
      let goalObjects = [
        {
          goals: workGoals,
          title: "Work & study",
          category: "work"
        },
        {
          goals: healthGoals,
          title: "Health & fitness",
          category: "health"
        },
        {
          goals: socialGoals,
          title: "Social life",
          category: "social"
        },
        {
          goals: financeGoals,
          title: "Finance",
          category: "finance"
        },
        {
          goals: otherGoals,
          title: "Misc.",
          category: "other"
        },
      ]

      res.render('user/dashboard', {
        userName: capitalizedUserName,
        zenQuote: response.data[0],
        goals: goalObjects,
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


// POST /goals
// add a goal in the database
router.post("/goals", isAuthenticated, (req, res, next) => {
  Goal.create({ 
    user_id: req.user._id,
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
router.post("/goals/:id/edit", isAuthenticated, (req, res, next) => {
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
      res.redirect('/user/dashboard');    
    })
})


// delete a goal from the database
router.post("/goals/:id/delete", isAuthenticated, (req, res, next) => {
  Goal.findByIdAndRemove(req.params.id)
  .then(() => res.redirect('/user/dashboard'))
  .catch((err) => res.redirect('/user/dashboard'))
})


// POST /tasks
// add task in the database
router.post("/tasks", isAuthenticated, (req, res, next) => {
  Task.create({ 
    user_id: req.user._id,
    goal_id: req.body.taskGoal,
    title: req.body.title
  })
    .then(newTask => res.redirect('/user/dashboard'))
    .catch(err => res.redirect('/user/dashboard'))
})


//update a task in the database
router.post("/tasks/:id/edit", isAuthenticated, (req, res, next) => {
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
      res.redirect('/user/dashboard');    
    })
})

router.post("/tasks/:id/done", isAuthenticated, (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, { isDone: req.body.isDone })
    .then(task => res.redirect('/user/dashboard'))
    .catch(err => {
      res.redirect('/user/dashboard');    
    })
})


//delete a task from the database
router.post("/tasks/:id/delete", isAuthenticated, (req, res, next) => {
  Task.findByIdAndRemove(req.params.id)
  .then(() => res.redirect("/user/dashboard"))
  .catch((err) => res.redirect('/user/dashboard'))
})


// GET /profile
// display profile page
router.get("/profile", isAuthenticated, (req, res, next) => {
  // capitalize first letter of user's first name
  let capitalizedUserName = req.user.firstName[0].toUpperCase() + req.user.firstName.substring(1);
  
  res.render("user/profile", {
    firstName: capitalizedUserName,
    email: req.user.email
  });
})


// POST /profile
// update profile infos
router.post("/profile", isAuthenticated, (req, res, next) => {

  const { firstName, email, password, newPassword, newPasswordCheck } = req.body;
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
  if (newPassword !== "" && newPassword !== newPasswordCheck) {
    return res.status(400).render("user/profile", {
      errorMessage: "Confirmation password must match new password",
    });
  }

  if (password !== "" && newPassword !== "" && newPassword === newPasswordCheck) {
    const salt = bcrypt.genSaltSync(saltRounds);
    newUser.password = bcrypt.hashSync(newPassword, salt);
  }
  
  User.findOneAndUpdate({ _id: req.user._id }, newUser)
  .then(user => {
    req.user = user;
    console.log("update user ==>", req.user);
    res.redirect("/user/profile");
  })
  .catch((err) => {
    res.redirect('/user/profile');
  })
})


module.exports = router;