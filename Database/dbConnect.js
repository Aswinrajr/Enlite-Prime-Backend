const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  console.log("Welcome to database")
  mongoose
    .connect(
          `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xf8fs26.mongodb.net/enlite_prime`
      , {
      serverSelectionTimeoutMS: 30000, 
      socketTimeoutMS: 45000, 
    })
    .then(() => {
      console.log("Connected to the database Atlas");
    })
    .catch((err) => {
      console.error("Error in connecting the database", err);
    });
};
 
module.exports = dbConnect;
