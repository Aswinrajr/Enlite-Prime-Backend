const User = require("../../Model/userModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const userRegistration = async (req, res) => {
  try {
    console.log("Welcome to user sign up", req.body);
    const { userName, email, mobile, password, confirmPassword } = req.body;
    console.log(userName, email, mobile, password, confirmPassword);

    let phone = mobile.replace("+91", "");

    const user = await User.findOne({ userEmail: email });
    console.log(user);

    if (user) {
      console.log("User is already registered, please login");
      return res
        .status(400)
        .json({ message: "User is already registered, please login" });
    } else {
      if (password === confirmPassword) {
        const hashPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed", hashPassword);
        const newUser = new User({
          userName: userName||"User",
          userEmail: email,
          userMobile: phone,
          userPassword: hashPassword,
        });
        await newUser.save();

        console.log("Sign Up successful");
        return res.status(201).json({ message: "Sign Up successful" });
      } else {
        console.log("Passwords do not match");
        return res.status(400).json({ message: "Passwords do not match" });
      }
    }
  } catch (err) {
    console.log("Error in user Registration", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  console.log("Welcome to user Login");
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ userEmail: email });
    console.log("User", user);

    if (user) {
      console.log(user.status);
      if (user.status == "Active") {
        const matchPassword = await bcrypt.compare(password, user.userPassword);
        if (matchPassword) {
          const secretKey = process.env.JWT_ADMIN_SECRET_KEY;
          //   const secretKey = "ASWINRAJ@ACHU#UHCAJARNIWSA";

          const token = jwt.sign(
            { userToken: user.userEmail, role: "user", userId: user._id },
            secretKey,
            {
              expiresIn: "24h",
            }
          );
          console.log("Token created", token);

          console.log("user login successful");
          res
            .status(200)
            .json({ msg: "user login successful", user: user, token: token });
        } else {
          console.log("Password is incorrect");
          res.status(401).json({ msg: "Incorrect password" });
        }
      } else {
        console.log("User is blocked");
        res
          .status(401)
          .json({ msg: "Something went wrong please contact admin" });
      }
    } else {
      console.log("user is not registered, please sign up");
      res.status(404).json({ msg: "user not registered, please sign up" });
    }
  } catch (err) {
    console.log("Error in user verification", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


const getUserIndividualData = async (req, res) => {
    try {
        const { userToken, role } = req.decoded;
        console.log(userToken, role)
  
        if (role != "user" && !userToken) {
          return res.status(401).json({ msg: "Unauthorized " });
        }
      console.log("Welcome to users data");
      const usersData = await User.find({userEmail:userToken});
  
      res.status(200).json(usersData);
    } catch (err) {
      console.log("Error in getting the users data", err);
    }
  };

module.exports = {
  userRegistration,
  userLogin,
  getUserIndividualData
};
