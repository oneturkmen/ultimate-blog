var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');

var auth = require('../models/auth');

// Show GET
router.get('/show/:category', auth.ensureAuthenticated, function(req, res, next) {
  var dbs = req.db;
  var posts = dbs.get('posts');

  posts.find({ category: req.params.category }, {}, function(err, data) {
    res.render('index', {
      "title": req.params.category,
      "posts": data
    });
  });
});

// Categories GET
router.get('/add', auth.ensureAuthenticated, function(req, res, next) {
  res.render('addcategory', {
    "title": "Add Category"
  })
});

router.post('/add', auth.ensureAuthenticated, function(req, res, next) {
  var dbs = req.db;

  var title = req.body.title;

  req.checkBody('title', 'Title field is required!').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('addpost', {
      "errors": errors,
      "title": title
    });
  } else {
    var categories = dbs.get('categories');

    categories.insert({
      "title": title
    }, function(err, data) {
      if (err) {
        res.send('Issue submitting a category');
      } else {
        req.flash('success', 'Category saved!');
        res.location('/');
        res.redirect('/');
      }
    });

  }
});


module.exports = router;
