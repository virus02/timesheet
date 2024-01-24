var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { run } from './services/mongodb/index';
import { verifyToken } from './middleware/verifyToken';

var apiRouter = require("./routes");

var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/api", apiRouter);

app.post("/api/login", async function (req, res, next) {
  const { email, password } = req.body;

  try {
    if(!email || !password) {
      res.status(400).send({ message: 'Missing email or password' });
    }
    const user = await run('timesheet', 'user_auth', 'find', {email: email});
    if(user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        let userDetails = await run('timesheet', 'users', 'find', {email: user.email});
        delete userDetails['_id'];
        const token = jwt.sign({ userId: user.email }, 'timesheet123', { expiresIn: '1h' });
        userDetails['token'] = token;
        res.status(200).send(userDetails);
      } else {
        res.status(401).send({ message: 'Invalid password' });
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch(error) {
    console.log(error);
  }
});

module.exports = app;