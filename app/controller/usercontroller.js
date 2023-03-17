const { User } = require("../models/auth.model");
const bcrypt= require("bcrypt")

exports.get = (req, res) => {
    
  res.send("index")

  };


exports.updateuserdetails = (req, res) => {

  

  try{
    const id = req.params.id.trim()
    const updates = req.body
    console.log(id);

    const users =User.findByIdAndUpdate(id,req.body,{ useFindAndModify: false })
    .then((response)=>{

      if(!response){
        res.status(404).send({message: "error Updating data "})
      }else{
        res.status(201).send({message: "Update successfully",response})
      }

    })
    


  }catch (error){
    res.status(400).send(error.message)
  }
   
  };

  exports.usercandeletetheirdetail=(req,res)=>{

    try {
      const id = req.params.id

      User.findByIdAndUpdate(id, { $set: { deletedAt: Date.now() } })
      .then((response)=>{

        if(!response){
          res.status(401).send({mesage:"error deleting your id"})
        }else{
          res.status(201).send({message: "Deleted  successfully"})
        }
        
      })
      
    } catch (error) {
      res.status(201).send({message: "Error Occur", error})
    }


  }
  exports. usercanrestoretheirdetail =(req,res)=>{

    try {
      const id = req.params.id

      User.findByIdAndUpdate(id, { $set: { deletedAt: null ,restoreAt: Date.now()}})
      .then((response)=>{

        if(!response){
          res.status(401).send({mesage:"error deleting your id"})
        }else{
          res.status(201).send({message: "Congratulation Your Account Successfully Restored"})
        }
        
      })
      
    } catch (error) {
      res.status(201).send({message: "Error Occur", error})
    }


  }



  exports.userpasswordchange= async (req,res)=>{

    
   
      const { currentPassword, newPassword ,confirmpassword} = req.body;
      const userId = req.params.id;
      
      // Find user in the database by ID
      const user = await User.findById(userId);
    


      // If user not found, return error
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      if (newPassword !== confirmpassword) {
            return res.status(400).json({ msg: "New password and confirm password do not match" });
          }
    
      // Compare current password with hashed password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
    
      // If current password doesn't match, return error
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid current password' });
      }
    
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
    
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
    
      res.status(200).json({ msg: 'Password updated successfully' });
   
    
    

  }


  // try {
    //   const id = req.params.id;
    //   const { current, newpassword, confirmpassword } = req.body;
    //   console.log(current, newpassword,confirmpassword);
    //   const user =  User.findOne(id);
    
    //   if (!user) {
    //     return res.status(401).send({ message: "could not found user with  `${id}` id " });
    //   }
  
    //   const isMatch = bcrypt.compare(current, user.password);
    
    //   if (!isMatch) {
    //     return res.status(400).json({ msg: "Invalid current password" });
    //   }
    
    //   if (newpassword !== confirmpassword) {
    //     return res.status(400).json({ msg: "New password and confirm password do not match" });
    //   }
    
    //   const hash =  bcrypt.hash(newpassword, 10);
    //    const userpass =User.findOneAndUpdate(id, { $set: { password: hash } });
    // if(userpass){
    //   res.status(200).send("password reset");
    //   console.log(user.password);
    // }
    // } catch (error) {
    //   // console.error(error);
    //   res.status(500).send({ message: "Error occurred while resetting your password" });
    // }