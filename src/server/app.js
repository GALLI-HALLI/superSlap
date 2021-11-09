const mongoose = require('mongoose');
const express = require("express");
const auth = require("./routes/auth");
const post = require("./routes/post");
const dotenv = require('dotenv');
dotenv.config({path: 'src/server/key.env'});

const app = express();

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
      mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, err=>{
          if(err){
              console.log(err);
          }else{
              console.log('connecte to data base successfully');
          }
      });
}
});