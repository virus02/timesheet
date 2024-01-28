var express = require("express");
const { 
  createActivity, 
  activityList, 
  getActivity, 
  editActivity 
} = require("./controller");

var app = express();

app.post("/createactivity", createActivity);

app.get("/activitylist", activityList);

app.get("/getactivity", getActivity);

app.patch("/editactivity", editActivity);

module.exports = app;