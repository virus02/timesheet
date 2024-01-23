var express = require("express");
const { createUser, userList } = require("./controller");

var app = express();

app.post("/createuser", createUser);

app.get("/userlist", userList);

module.exports = app;