var express = require("express");
const { 
  createUser, 
  userList, 
  getUser, 
  editUser 
} = require("./controller");

var app = express();

app.post("/createuser", createUser);

app.get("/userlist", userList);

app.get("/getuser", getUser);

app.patch("/edituser", editUser)

module.exports = app;