var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

  // Form validation -> handle the checking if everything is present
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
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


        // Success message
        req.flash('success', 'Yay! You are successfully registered.');
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
