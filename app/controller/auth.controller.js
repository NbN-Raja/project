const bcrypt = require("bcrypt");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const {User,Udetails} = require("../models/auth.model");
const { body, validationResult } = require("express-validator");
const { response } = require("express");
var jwt = require("jsonwebtoken");
const { jwtSecret } = require("../auth/config");
const { isObjectIdOrHexString, isValidObjectId } = require("mongoose");
var geoip = require('geoip-lite');
var ip = require('ip');


exports.get = (req, res) => {};



exports.login = async (req, res) => {
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

    // Create token
    const token = jwt.sign({ id: user.id }, jwtSecret);
    // const detaills = await User.findOne({ ip });
    // if (detaills) {
    //   return res
    //     .status(400)
    //     .json({ message: "User With this email already exists " });
    // }
    // // Create user details
    // const udetails = new Udetails({
    //   ip: ip.address(),
    //   location: req.body.location,
    //   code: req.body.code,
    //   timezone: req.body.timezone,
    //   user: user._id
    // });

    // // Save user details
    // await udetails.save();

    // Send response
    res.status(201).json({ message: "User Login successfully", token });
  
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

    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    const ipp = ip.address();
    const udetails = new Udetails({
      user: user._id,
      ip: ipp
    });
    await udetails.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.details = async (req, res) => {

  const ipp = ip.address();
  
var geo = geoip.lookup(ipp);
  const userId = req.params.id.trim();
const filter = { _id: userId };
  // console.log(id);
  // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //   return res.status(400).json({ message: 'Invalid user ID' });
  // }

  const users= User.findOne(filter).exec()
  .then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Maybe user was not found!`,
      });
    } else {
      res.send({data});
      
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Invalid User id"
    });
  });


};



exports.getalluserdetail = (req, res) => {};
