const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();


const dataBase = require("./Database/dbConnect");
const adminRoute = require("./Routes/adminRoute")
const userRoute = require("./Routes/userRoute")

const app = express();
const PORT = process.env.PORT || 1999;

app.set("trust proxy", true);

dataBase();

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS error for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.disable("x-powered-by");

app.use("/uploads", express.static("uploads"));

app.use("/admin", adminRoute);
app.use("/",userRoute)

app.listen(PORT, () => {
  console.log(`Application is running on port: ${PORT}`);
});
