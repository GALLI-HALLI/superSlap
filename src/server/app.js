const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const fs = require("fs");
const express = require("express");
const auth = require("./routes/auth");
const post = require("./routes/post");
const path = require("path");
const socket = require("socket.io");
const http = require("http");
const backApi = require("./backApi");

const app = express();
const server = http.createServer(app);
const io = socket(server);
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
app.use("/api", backApi);

app.use(express.static(path.join(__dirname, "../../build")));

// '/*' : /에 글자 상관없이 매칭 된다.
app.get("/*", function (request, response) {
  response.sendFile(path.join(__dirname, "../../build/index.html"));
});

app.get("/game/:code", function (request, response) {
  response.sendFile(path.join(__dirname, "/room/game.html")); //*****FE 바꾸기********
});

const gameSocket = io.of("/game");

const userConnect = require("./room/group.js");

gameSocket.on("connection", (socket) => {
  userConnect(socket);
});

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to data base successfully");
    server.listen(3333, (err) => {
      console.log("server on");
      if (err) {
        return console.log(err);
      }
    });
  }
});
