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
  // TODO: récupérer l'objet "zenQuote" grâce à l'API Zen Quote

  // TODO: chercher les tâches et objectifs du user dans la DB
  // TODO: filtre des tâches : endDate = today, endDate < today and isDone = false
  // TODO: filtre des objectifs : isDone = false

  // capitalize first letter of user's first name
  req.session.user.firstName = req.session.user.firstName[0].toUpperCase() + req.session.user.firstName.substring(1)
  
  // TODO: exécuter le render une fois que toutes les promise sont faites
  res.render("user/dashboard", {
    currentUser: req.session.user,
    zenQuote: "",
    currentGoals: "",
    todayTasks: "",
    overdueTasks: ""
  })
    
})

// POST /dashboard
router.post("", isLoggedIn, (req, res, next) => {
  // TODO: permettre au user d'ajouter des tâches et des objectifs dans la DB
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