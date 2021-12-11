const router = require("express").Router();
const mongoose = require("mongoose");
const axios = require("axios");

// database models
const User = require("../models/User.model");
const Goal = require("../models/Goal.model");
const Task = require("../models/Task.model");

// middleware to control access to specific routes
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

// GET /dashboard
router.get("/dashboard", (req, res, next) => {
  // 
  if (!req.session.user) return res.redirect('/login')

  // capitalize first letter of user's first name
  req.session.user.firstName = req.session.user.firstName[0].toUpperCase() + req.session.user.firstName.substring(1);
  // TODO: récupérer l'objet "zenQuote" grâce à l'API Zen Quote
  const p1 = axios.get('https://zenquotes.io/api/today/');
  // TODO: chercher les objectifs du user dans la DB
  // TODO: filtre des objectifs : isDone = false  
  const p2 = Goal.find({/* user_id: req.session.user.id,*/ isDone: false });
  // TODO: chercher les tâches du user dans la DB
  // TODO: filtre des tâches : endDate = today, endDate < today and isDone = false  
  const p3 = Task
              .find({/* user_id: req.session.user.id,*/ endDate: { $lte: Date.now() }, isDone: false })
              //.populate('goal_id');
  // TODO: filtre des tâches en retard: endDate > today and isDone = false  
  const p4 = Task.find({/* user_id: req.session.user.id,*/ endDate: { $gt: Date.now() }, isDone: false });

  Promise.all([p1, p2, p3, p4])
    .then(function([response, goalsFromDb, tasksFromDb, overdueTasksFromDb]) {

      function getGoal(goalid) {
        return goalsFromDb.find(el => el.id === goalid)
      }
      tasksFromDb.forEach((task, i) => {
        const goal = getGoal(''+task.goal_id) // add a .goal property of the matching goal
        console.log('goal=', goal)
        tasksFromDb[i].goal = goal
      })
      console.log('tasksFromDb=', tasksFromDb)

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
      //other
    

      res.render('user/dashboard', {
        currentUser: req.session.user,
        zenQuote: response.data[0],
        workGoals: workGoals,
        healthGoals: healthGoals,
        socialGoals: socialGoals,
        todayTasks: tasksFromDb,
        overdueTasks: overdueTasksFromDb
      })
    })
    .catch(err => {
      next(err)
    })
})

// POST /dashboard
//Goals routes
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
  Goal.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    color: req.body.color,
    //category: req.body.category
  })
    .then(goal => res.redirect('/user/dashboard'))
    .catch((err) => res.redirect('/user/dashboard'))
})

router.post("/goals/:id/delete", isLoggedIn, (req, res, next) => {
  Goal.findByIdAndRemove(req.params.id)
  .then(() => res.redirect("/user/dashboard"))
  .catch((err) => res.redirect('/user/dashboard'))
})


//Tasks routes
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
  // TODO: permettre au user d'ajouter des tâches dans la DB
  Task.findByIdAndUpdate(req.params.id, {
    user_id: req.session.user._id,
    goal_id: req.body.taskGoal,
    title: req.body.title
  })
    .then(task => res.redirect('/user/dashboard'))
    .catch(err => res.redirect('/user/dashboard'))
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
router.post("", isLoggedIn, (req, res, next) => {
  //TO DO: récupérer les valeurs des champs modifiés

  //TO DO: Ne pas envoyer un nouveau mot de passe si pas de modification du champ "password"

  //TO DO: encrypter le nouveau mot de passe
  
  //TO DO: update la DB
})


module.exports = router;