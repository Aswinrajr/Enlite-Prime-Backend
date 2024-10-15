const express = require("express");
const adminRoute = express();

const adminController = require("../Controller/Admin/adminController")
const adminAuth = require("../Middleware/adminMid")


adminRoute.get("/", adminController.adminLogin);
adminRoute.post("/login", adminController.adminVerifyLogin);
adminRoute.get("/getusers",adminController.getUsersData);
adminRoute.post("/useraction",adminController.userAction);
adminRoute.get("/userdata/:id",adminController.getuserData);

adminRoute.post("/userupdate/:id",adminController.updateUserData);


module.exports = adminRoute;