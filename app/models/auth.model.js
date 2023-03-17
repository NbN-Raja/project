const mongoose= require("mongoose")
const Joi = require('joi');
const { body, validationResult } = require('express-validator');
const { date } = require("joi");
require("../auth/roles")


const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email address already taken"],
    },
    password: {
        type:String,
        required:true,
      },
    age: {
      type: Number,
      default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
      },
      birth:{
        type:Date,
        required:true
      },

      gender:{
        enum:["Male","Female","Others"],
        required:true,
        type:String
      },
      address:{
        type: String,
        required:true
      },
      role: { type: String, default: "USER"} ,// Default role is user
      deletedAt: {
        type: Date,
        default: null,
      },
      restoreAt: {
        type: Date,
        default: null,
      },


  });

  const DetailSchema  = new mongoose.Schema({
    user_id: String,
    street: String,
    ip:String,
    city: String,
    state: String,
    country: String,
    detail: { type: mongoose.Schema.Types.ObjectId, ref: 'userdetail' }

  });

  
  const User = mongoose.model("User", UserSchema);
  const Udetails = mongoose.model('Detail', DetailSchema );

  
  
  module.exports = {User,Udetails};
