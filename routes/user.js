const router = require("express").Router();
const mongoose = require("mongoose");
const axios = require("axios");

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

  // http://localhost:3000/user/dashboard?goal_id=61b1fcf6d094e9c73114f827
  console.log('req.query ===', req.query) // req.query === { goal_id: '61b1fcf6d094e9c73114f827' }

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

  Promise.all([p1, p2, p3, p4])
    .then(function(values) {
      //console.log('values=', values)
      const [response, goalsFromDb, tasksFromDb, overdueTasksFromDb] = values;

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
        overdueTasks: overdueTasksFromDb
      })
    })
    .catch(err => {
      next(err)
    })
})

// POST /dashboard

// POST /goals
router.post("/goals", isLoggedIn, (req, res, next) => {
  // TODO: permettre au user d'ajouter des objectifs dans la DB
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

router.post("/goals/:id/delete", isLoggedIn, (req, res, next) => {
  Goal.findByIdAndRemove(req.params.id)
  .then(() => res.redirect('/user/dashboard'))
  .catch((err) => res.redirect('/user/dashboard'))
})


// POST /tasks
router.post("/tasks", isLoggedIn, (req, res, next) => {
  // TODO: permettre au user d'ajouter des tâches dans la DB
  Task.create({ 
    user_id: req.session.user._id,
    goal_id: req.body.taskGoal,
    title: req.body.title
  })
    .then(newTask => res.redirect('/user/dashboard'))
    .catch(err => res.redirect('/user/dashboard'))
})

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

router.post("/tasks/:id/delete", isLoggedIn, (req, res, next) => {
  Goal.findByIdAndRemove(req.params.id)
  .then(() => res.redirect("/user/dashboard"))
  .catch((err) => res.redirect('/user/dashboard'))
})

// GET /profile
router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile", {
    currentUser: req.session.user
  });
})

// POST /profile
router.post("/profile", isLoggedIn, (req, res, next) => {
  //TO DO: récupérer les valeurs des champs modifiés
  //TO DO: Ne pas envoyer un nouveau mot de passe si pas de modification du champ "password"
  //TO DO: encrypter le nouveau mot de passe

  const { firstName, email, password, newPassword, newPasswordChecked } = req.body;
  const newUser = {};

  newUser.firstName = firstName;
  newUser.email = email;

  if (password !== '' && newPassword !== '' && newPassword === newPasswordChecked) {
    const salt = bcrypt.genSaltSync(saltRounds);
    newUser.password = bcrypt.hashSync(newPassword, salt);
  }
  
  //TO DO: update la DB
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

module.exports = router;