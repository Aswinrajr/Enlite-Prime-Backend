const express = require("express");
const userRoute = express();

const userController = require("../Controller/User/userController");
const userAuth = require("../Middleware/userAuth");


userRoute.post("/signup", userController.userRegistration);
userRoute.post("/login", userController.userLogin);
userRoute.get("/individualdata",userAuth, userController.getUserIndividualData);


module.exports = userRoute;