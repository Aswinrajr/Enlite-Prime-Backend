const Admin = require("../../Model/adminModel");
const User = require("../../Model/userModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

//ADMIN REGISTRATION
const adminLogin = async (req, res) => {
  console.log("Welcome to admin login page");
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminMobile = process.env.ADMIN_MOBILE;

  console.log("adminEmail", adminEmail);

  const admin = await Admin.findOne();
  console.log("Admin", admin);
  if (!admin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    console.log("Password hashed", passwordHash);
    const admin = new Admin({
      adminEmail,
      adminMobile,

      adminPassword: passwordHash,
    });
    await admin.save();
    console.log("Admin registered ");
    res.status(201).json({ status: "Admin Created successfully" });
  } else {
    console.log("else");
    res.status(201).json({ status: "Admin exist" });
  }
};

//ADMIN VERIFICATION
const adminVerifyLogin = async (req, res) => {
  console.log("Welcome to admin login");
  const { email, password } = req.body;
  console.log("Req.body", req.body);
  const admin = (await Admin.findOne({ adminEmail: email })) || "admin";
  const SECRET_KEY = process.env.JWT_ADMIN_SECRET_KEY;
  try {
    console.log(admin);

    if (admin) {
      const matchPassword = await bcrypt.compare(password, admin.adminPassword);

      if (matchPassword) {
        const token = jwt.sign(
          { adminToken: admin.adminEmail, role: "admin", adminId: admin._id },
          SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );

        console.log("Token created and dashboard", token);

        res.status(200).json({
          msg: "Login successful",
          admin: admin,
          token: token,
          role: "Admin",
        });
      } else {
        console.log("Password incorrect");
        res.status(401).json({ msg: "Incorrect password" });
      }
    } else {
      console.log("Admin not founds");
      res.status(404).json({ msg: "Admin not found" });
    }
  } catch (err) {
    console.log("Error in verify admin", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getUsersData = async (req, res) => {
  try {
    //   const { adminToken, role } = req.decoded;

    //   if (role != "admin" && !adminToken) {
    //     return res.status(401).json({ msg: "Unauthorized " });
    //   }
    console.log("Welcome to users data");
    const usersData = await User.find();

    res.status(200).json(usersData);
  } catch (err) {
    console.log("Error in getting the users data", err);
  }
};

const userAction = async (req, res) => {
  try {
    console.log("User action", req.body);
    const users = await User.findOne({ _id: req.body.id });
    console.log(users);
    if (users.status === "Active") {
      users.status = "Blocked";
    } else {
      users.status = "Active";
    }
    await users.save();
    console.log(users);
    res
      .status(200)
      .json({ message: "User status updated successfully", users });
  } catch (error) {
    console.log("error in user actions", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getuserData = async (req, res) => {
  try {
    const {id} = req.params

    const users = await User.findOne({ _id: id });
    console.log(users);
   
    res
      .status(200)
      .json({ message: "User data fetch successfully", users });
  } catch (error) {
    console.log("error in user actions", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserData = async (req, res) => {
  try {
    console.log("Welcome to update the user", req.body);
    const {id} = req.params
    const { userEmail, userName, status, } = req.body.userData;
   

    const updatedUser = await User.updateOne(
      { _id: id, status: "Active" },
      {
        $set: {
          userName: userName,
          userEmail: userEmail,
          status: status,
        },
      },
      { new: true }
    );
    console.log("Updated");

    res.status(200).json({
      success: true,
      message: "User data updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log("Error in updating the data", err);
    res.status(500).json({
      success: false,
      message: "Error updating user data",
      error: err.message,
    });
  }
};

module.exports = {
  adminLogin,
  adminVerifyLogin,
  getUsersData,
  userAction,
  updateUserData,
  getuserData
  
};
