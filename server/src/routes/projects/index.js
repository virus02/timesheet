var express = require("express");
const { 
  createProject, 
  projectList, 
  getProject, 
  editProject 
} = require("./controller");

var app = express();

app.post("/createproject", createProject);

app.get("/projectlist", projectList);

app.get("/getproject", getProject);

app.patch("/editproject", editProject);

module.exports = app;