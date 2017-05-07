var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Sockets!

var bodyParser = require('body-parser');

var mongo = require('mongodb');
var multer = require('multer');
var flash = require('connect-flash');

// Routes
var routes = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');
var users = require('./routes/users');
var chat = require('./routes/chat');

// Models
var Auth = require('./models/auth');

// Mongo Database
var db = require('monk')('localhost/nodeblog');

var app = express();

app.locals.moment = require('moment');

app.locals.truncateText = function(text, length) {
  var truncatedText = text.substring(0, length);
  return truncatedText;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Multer -> for file exchange
app.use(multer({ dest: path.join(__dirname, 'public/images/uploads') }).any());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// passport -> initialize 'passport' session
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
          root      = namespace.shift(),
          formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },
  /* FIXME:
    1) Add password check (minimum 1 capital letter, 1 number at least)
    2) Password and username cannot start with number
  */
  customValidators: {
    isMinimumSize: function (param) {
      return ( param.length >= 6 ? true : false );
    },
    notMaximumSize: function(param) {
      return ( param.length <= 12 ? true : false);
    },
    noSpaces: function(param) {
      return ( param.indexOf(' ') >= 0 ? false : true );
    },
    passwordIsOk: function(param) {
      return Auth.validatePassword(param);
    }
  }
}));

// Use folder with static (public) files
app.use(express.static(path.join(__dirname, 'public')));

// connect-flash
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Access DB in any route
app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/posts', posts);
app.use('/categories', categories);
app.use('/users', users);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.render('404', {
    title: '404: Not found sry'
  });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
