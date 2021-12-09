const router = require("express").Router();
const mongoose = require("mongoose");

// database models
const User = require("../models/User.model");
const Goal = require("../models/Goal.model");
const Task = require("../models/Task.model");

// middleware to control access to specific routes
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

// GET /dashboard
router.get("/dashboard", isLoggedIn, (req, res, next) => {
  // TODO: chercher les objectifs du user dans la DB
  Goal.find({})
    .then(GoalsFromDb => res.render('user/dashboard', {workGoals: GoalsFromDb}))
    .catch(err => next(err))
})

router.get("/dashboard", isLoggedIn, (req, res, next) => {
  // TODO: récupérer l'objet "zenQuote" grâce à l'API Zen Quote

  // TODO: filtre des objectifs : isDone = false

  // TODO: chercher les tâches du user dans la DB
  Task.find({ isDone: false })
    .then(taskFromDb => res.render('user/dashboard', {todayTasks: taskFromDb}))
    .catch(err => next(err))

  // TODO: filtre des tâches : endDate = today, endDate < today and isDone = false
    //Task.find({ $and: [ { endDate: { $lte: Date.now } }, { isDone: false} ] })

  // capitalize first letter of user's first name
  req.session.user.firstName = req.session.user.firstName[0].toUpperCase() + req.session.user.firstName.substring(1);
  
  // TODO: exécuter le render une fois que toutes les promise sont faites
  /*res.render("user/dashboard", {
    currentUser: req.session.user,
    zenQuote: "",
    currentGoals: "",
    todayTasks: "",
    overdueTasks: ""
  })*/
    
})

// POST /dashboard
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
    .catch((err) => res.render('/user/dashboard'))
})

router.post("/tasks", isLoggedIn, (req, res, next) => {
  // TODO: permettre au user d'ajouter des tâches dans la DB
  Task.create({ 
    user_id: req.session.user._id,
    goal_id: req.body._id,
    title: req.body.title
  })
    .then(newTask => res.redirect('/user/dashboard'))
    .catch(err => res.render('/user/dashboard'))
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