var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* Models: */
/* Email -> for registration notification (to user's email) */
/* User  -> for user authorization/authentication */
/* Auth  -> to be sure that user if authorized into the system */
var Email = require('../models/email');
var User = require('../models/user');
var auth = require('../models/auth');

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login'} );
});

// REGISTER get & post requests
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register'} );
});


router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  /* Form validation -> handle the checking if everything is present */
  /* isMinimumSize() is custom validator */
  req.checkBody('name', 'Name field is required').notEmpty();

  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();

  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('username', 'Minimum 5 characters required for username').isMinimumSize();
  req.checkBody('username', 'Maximum 12 characters allowed for username').notMaximumSize();

  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password', 'Minimum 5 characters required for password').isMinimumSize();
  req.checkBody('password', 'Maximum 12 characters required for username').notMaximumSize();
  req.checkBody('password', 'No spaces in the password please').noSpaces();
  req.checkBody('password', 'At least 1 symbol, 1 capital letter, and 1 number required').passwordIsOk();

  req.checkBody('password2', 'Passwords do not match').equals(password);

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
      title: 'Register',
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    // Create User using User() module
    var newUser = {
      name: name,
      email: email,
      username: username,
      password: password,
    };

    // Create User
    User.checkUserExistence(newUser, (err, user_g) => {
      if (err) throw err;

      if (!user_g) {

        User.createUser(newUser, function(err, user) {
          if (err) {
            throw err;
          }
          else {
            // function defined in the model (../models/user.js);
            User.insertUser(user);
          }
        });

        /* Send email notification of registration to the user */
        Email.sendEmailNotification(newUser);

        // Success message
        req.flash('success', 'Yay! You are successfully registered. You must have received an email from us...');
        res.location('/');
        res.redirect('/');
      }
      else {
        req.flash('error', 'User already exists!');
        res.location('/users/register');
        res.redirect('/users/register');
      }
    });
  }

});

// Passport serialize and deserialize
// ---------
passport.serializeUser(function(user, done) {
  console.log("serializing...");
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserializing...");
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy( function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      // Handle errors
      if (err) throw err;

      // If username does not match db
      if (!user) {
        console.log('Unknown user');
        return done(null, false, { message: 'Unknown user' });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;

        if (isMatch) {
          console.log('password match');
          return done(null, user);
        }
        else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }
));


router.post('/login', passport.authenticate('local',
      {
        failureRedirect:'/users/login/',
        failureFlash: 'Invalid Username or password',
        failureFlash: true
      }
    ),
    function (req, res) {
        req.flash('success', 'You are logged in.');
        res.redirect('/');
});

router.get('/logout', auth.ensureAuthenticated, function(req, res, next) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/users/login');
});

module.exports = router;
