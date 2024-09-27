const express = require('express')

const cors = require('cors')

const mongoose = require('mongoose')

const path = require("path");

const cookieParser = require("cookie-parser");

const app = express();

require("dotenv").config();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser())

const userRouter = require("./Router/User")

const adminRouter = require("./Router/Admin")

app.use(userRouter)

app.use(adminRouter)

app.listen(5000, () => {
    connectDatabase();
    console.log("server started at port 5000")
})

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.database);
    console.log("database connected");
  } catch (err) {
    console.log(err.message);
  }
}