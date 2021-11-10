const mongoose = require('mongoose');
const express = require("express");
const auth = require("./routes/auth");
const post = require("./routes/post");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// google-oauth
const passport  = require('passport');
const session   = require('express-session');  // express-session 설정이 반드시 passport-session 위에 있어야 함
app.use(session({secret:'MySecret', resave: false, saveUninitialized:true}));

// Passport setting
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', require('./routes/auth'));

//앱세팅-front
app.set("views", "../view");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/routes`));

app.use(express.json());

app.use("/auth", auth); //auth주소는 auth파일로 간다
app.use("/post", post);

app.get("/", (req, res) =>{
  res.send("Hi I am worrking");
});

app.listen(5000, (err)=>{
  console.log('server on');
  if(err){
    return console.log(err);
  }else{
      mongoose.connect("mongodb+srv://root:1234@namu.slulh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true}, err=>{
      // mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, err=>{
          if(err){
              console.log(err);
          }else{
              console.log('connected to data base successfully');
          }
      });
}
});