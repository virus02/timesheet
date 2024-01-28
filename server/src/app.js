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
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3001',
}));

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
        const refresh = jwt.sign({ userId: user.email }, 'timesheet123', { expiresIn: '1d' });
        res.cookie('jwt', refresh, {
          httpOnly: true,
          secure: true,
          path: '/api/refresh',
        });
        res.cookie('email', email, {
          httpOnly: true,
          secure: true,
          path: '/api/refresh'
        });
        userDetails['token'] = token;
        return res.status(200).send(userDetails);
      } else {
        return res.status(401).send({ message: 'Invalid password' });
      }
    } else {
      return res.status(404).send({ message: 'User not found' });
    }
  } catch(error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/api/refresh', async function(req, res) {
  try {
    if(req.cookies.jwt) {
      const refreshToken = req.cookies.jwt;
      const userEmail = req.cookies.email;
      const user = await run('timesheet', 'users', 'find', {email: userEmail});
      const role = user.role;
      jwt.verify(refreshToken, 'timesheet123', (err, decoded) => {
        if(err) {
          res.status(401).send({ message: 'Unauthorized' });
        } else {
          const accessToken = jwt.sign({userId: userEmail }, 'timesheet123', { expiresIn: '1h' });
          res.status(200).send({ role: role, token: accessToken });
        }
      });
    } else {
      res.status(406).json({ message: 'Unauthorized' });
    }
  } catch(err) {
    console.log(err);
  }
});

app.use("/api", apiRouter);

module.exports = app;