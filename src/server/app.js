const mongoose = require("mongoose");

const fs = require("fs");

const express = require("express");
const auth = require("./routes/auth");
const post = require("./routes/post");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

const socket = require("socket.io");

const app = express();

// google-oauth
const passport = require("passport");
const session = require("express-session"); // express-session 설정이 반드시 passport-session 위에 있어야 함
app.use(
  session({ secret: "MySecret", resave: false, saveUninitialized: true })
);


// Passport setting
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extend: true }));

app.use("/auth", auth);
app.use("/post", post);

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "/build/index.html"));
});

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to data base successfully");
    app.listen(5000, (err) => {
      console.log("server on");
      if (err) {
        return console.log(err);
      }
    });
  }
});
