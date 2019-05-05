var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var MongoClient = require("mongodb").MongoClient;
var config = require("./config");

var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);

var db = null;
var MONGO_DB_URL =
  "mongodb://" +
  config.mongoDatabase.user +
  ":" +
  config.mongoDatabase.password +
  "@" +
  config.mongoDatabase.host +
  ":" +
  config.mongoDatabase.port +
  "/" +
  config.mongoDatabase.database;
var APP_HOST = "localhost";
var APP_PORT = process.env.PORT || config.http.listenPort;

var index = require("./routes/index");
var channels = require("./routes/channels");

/**
 * Set up the environment for the application
 */
var initialize = function(callback) {
  /*Pass db and io to routes*/
  app.use(function(req, res, next) {
    req.db = db;
    req.io = io;
    next();
  });

  /*Moment*/
  app.locals.moment = require("moment");

  /**
   * configure express
   */
  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");

  // uncomment after placing your favicon in /public
  app.use(favicon(__dirname + "/public/favicon.ico"));
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/", index);
  app.use("/channels", channels);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render("error", {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: {}
    });
  });

  /**
   * Connect to MongoDB and start the server
   */
  MongoClient.connect(MONGO_DB_URL, { useNewUrlParser: true }, function(err, client) {
    if (err) return callback(err);

    // Save the db reference
    db = client.db();

    // Return the callback
    callback(null, app, io, db);
  });
};

var run = function(callback) {
  server.listen(APP_PORT, function(err) {
    if (err) {
      db.close();
      return callback(err);
    }

    // Print out a message to the console
    console.log("Server started at port " + APP_PORT);

    // Return successful start of server
    callback(null);
  });
};

exports.initialize = initialize;
exports.run = run;
