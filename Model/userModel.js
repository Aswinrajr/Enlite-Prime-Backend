const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userMobile: {
    type: Number,
    required: true,
    // unique:true
  },
  userPassword: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  userAdress: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    default: "Active",
  },
  role: {
    type: String,
    default: "User",
  },



});

module.exports = mongoose.model("user", userSchema);
