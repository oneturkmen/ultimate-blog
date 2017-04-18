var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');

// Show GET
router.get('/show/:category', function(req, res, next) {
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
router.get('/add', function(req, res, next) {
  res.render('addcategory', {
    "title": "Add Category"
  })
});

router.post('/add', function(req, res, next) {
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
