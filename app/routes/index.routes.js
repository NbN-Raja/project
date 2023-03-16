module.exports=(app)=>{
var router = require("express").Router();
const indexcontroller= require("../controller/indexcontroller.js")

router.get("/",indexcontroller.get)

    app.use("/api/v2", router);
}