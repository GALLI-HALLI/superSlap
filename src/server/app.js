const express = require("express");
const path = require("path");
var http = require("http");

const app = express();

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "../../build")));

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "../../build/index.html"));
});

server.listen(3000, function () {
  console.log("Server on!");
});
