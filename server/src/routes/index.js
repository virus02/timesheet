var express = require("express");
var router = express.Router();

var user = require("./users");

router.use("/user", user);

module.exports = router;