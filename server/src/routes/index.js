var express = require("express");
var router = express.Router();

var user = require("./users");
var project = require("./projects");
var activity = require("./activities");

router.use("/user", user);
router.use("/project", project);
router.use("/activity", activity);

module.exports = router;