const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { MongoClient } = require('mongodb');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

let db = null;
let client = null;
const MONGO_DB_URL = process.env.MONGO_URI;
const APP_PORT = process.env.PORT || 8080;

const index = require('./routes/index');
const channels = require('./routes/channels');

/**
 * Set up the environment for the application
 */
const initialize = async function () {
  /*Pass db and io to routes*/
  app.use(function (req, res, next) {
    req.db = db;
    req.io = io;
    next();
  });

  /*Moment*/
  app.locals.moment = require('moment');

  /**
   * configure express
   */
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  // uncomment after placing your favicon in /public
  app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', index);
  app.use('/channels', channels);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
    });
  });

  /**
   * Connect to MongoDB
   */
  client = new MongoClient(MONGO_DB_URL);
  await client.connect();
  db = client.db();

  return { app, io, db };
};

const run = function () {
  return new Promise((resolve, reject) => {
    server.listen(APP_PORT, function (err) {
      if (err) {
        client.close();
        return reject(err);
      }

      // Print out a message to the console
      console.log('Server started at port ' + APP_PORT);

      // Return successful start of server
      resolve();
    });
  });
};

exports.initialize = initialize;
exports.run = run;
