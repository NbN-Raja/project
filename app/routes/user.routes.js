module.exports=(app)=>{
var router = require("express").Router();
const usercontroller= require("../controller/usercontroller.js")

router.get("/update",usercontroller.get)

router.put("/update/:id",usercontroller.updateuserdetails)

router.put("/delete/:id",usercontroller.usercandeletetheirdetail)

router.put("/restore/:id",usercontroller.usercanrestoretheirdetail)

router.put("/password/:id",usercontroller.userpasswordchange)


app.use("/api/users", router);
}