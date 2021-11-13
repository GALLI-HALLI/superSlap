const mongoose = require("mongoose");
const express = require("express");
const auth = require("./routes/auth");
const post = require("./routes/post");
const dotenv = require("dotenv");
dotenv.config();

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

//################################################### 지워야 할 부분! 잊지 말자! #############################################################
//앱세팅-front
app.set("views", "../view");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/routes`));
//################################################### 지워야 할 부분! 잊지 말자! #############################################################

app.use(express.json());
app.use(express.urlencoded({ extend: true }));

app.use("/auth", auth); //auth주소는 auth파일로 간다
app.use("/post", post);

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
