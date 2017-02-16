var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('express-session');
var session = require('client-sessions');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var app = express();


mongoose.connect('mongodb://localhost/myMedicalDB');
var routes = require('./routes/index');
var user = require('./routes/users');
var authenticationHandler = require('./routes/authenticationHandler')(passport);


var initPassport = require('./passport-init');
initPassport(passport);



app.use(session({
  cookieName: 'session',
  secret: 'myMedical',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});
//
//Add socket.js link here
//

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'authFolder')));
app.use('/', routes);
app.use('/auth',authenticationHandler);

// view engine setup

app.use(function(req, res, next) {
  //console.log("**************** checking for authentication ************ ");
  if (req.isAuthenticated())
  {
    return next();
  }
  else
  {

    return res.redirect('/index.html');
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', user);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
//console.log(err.message);
 res.render('error', {
   message: err.message,
    error: {}
 });
});

module.exports = app;
