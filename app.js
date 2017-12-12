'use strict';

const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv');

const configurePassport = require('./helpers/passport');
const response = require('./helpers/response');

const auth = require('./routes/auth');
const polls = require('./routes/polls');

const app = express();

dotenv.config();

// database config
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// session config
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// passpport config
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// middlewares
app.use(cors({
  credentials: true,
  origin: [process.env.CLIENT_URL]
  //
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// -- routes

app.use('/auth', auth);
app.use('/polls', polls);

// -- 404 and error handler

app.use(function(req, res) {
  return response.notFound(req, res);
});

// error handler
app.use(function(err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only send response if the error ocurred before sending the response
  if (!res.headersSent) {
    return response.unexpectedError(req, res);
  };
});

module.exports = app;
