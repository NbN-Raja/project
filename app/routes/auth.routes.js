module.exports = function(app) {
    var router = require("express").Router();
  const validateUserInput = require("../models/auth.model")
    const authcontroller = require("../controller/auth.controller")
  /* GET home page. */
  router.get('/get',authcontroller.get)
  
  router.post("/login",authcontroller.login)

  router.post("/register",authcontroller.register)
  router.get("/users/:id",authcontroller.details)

 

  app.use("/api/auth", router);

  
  
  }
  