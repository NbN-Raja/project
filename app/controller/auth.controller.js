const bcrypt = require("bcrypt");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const { User, Udetails } = require("../models/auth.model");
const { body, validationResult } = require("express-validator");
const { response } = require("express");
var jwt = require("jsonwebtoken");
const { jwtSecret,jwtSecretrefresh } = require("../auth/config");
const { isObjectIdOrHexString, isValidObjectId } = require("mongoose");
var geoip = require("geoip-lite");
var ip = require("ip");
require("../auth/roles");

exports.get = (req, res) => {};

exports.login = async (req, res,next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // find email in database
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const passwordCompare = bcrypt.compareSync(password, user.password);

    if (!passwordCompare) {
      res.status(404).send({ message: "Email or password incorrect" });
      return;
    }
   
    // Redirect to login page if user is not authenticated or doesn't have admin role
   
    // const refreshToken = jwt.sign({ id: user.id, role: user.role },jwtSecretrefresh, jwtSecret,{ expiresIn: '1800s' });
    
    // Create token
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret,{ expiresIn: '1800s' });
    if (user.role === 'ADMIN') {
     
      res.status(200).send({message: "You are  Admin"});
    }
      
    // Send response
    res.status(201).send({ message: "User Login Successfully",token});
  } catch (error) {
    res.status(400).send({ message: "Error fetching data", error });
  }
};

exports.register = async (req, res) => {
  try {
    await body("email").isEmail().normalizeEmail().run(req);
    await body("email").isLength({ min: 5 }).normalizeEmail().run(req);
    await body("password").isLength({ min: 5 }).run(req);

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const { username, email, password, age, confirmPassword, address, birth } =
      req.body;

    if (username.length < 5) {
      return res
        .status(400)
        .json({ message: "Username must be at least 5 characters long" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!age || isNaN(age) || age < 10 || age > 150) {
      return res
        .status(400)
        .json({ message: "Age must be a number between 1 and 150" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User With this email already exists " });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const role= req.body.role

    const user = new User({
      ...req.body,
      password: hashedPassword,
      
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.details = async (req, res) => {
  const userId = req.params.id.trim();
  const filter = { _id: userId };

  try {
    const data = await User.findOne(filter).exec();

    if (!data) {
      res.status(404).send({
        message: `User with id ${userId} not found`,
      });
    } else if (data.deletedAt !== null) {
      res.status(201).send({ message: "User Id Does Not Exist" });
    } else {
      res.send({ data });
    }
  } catch (err) {
    res.status(500).send({
      message: "Internal server error",
    });
  }
};


exports.getalluserdetail = (req, res) => {};
