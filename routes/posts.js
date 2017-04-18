var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

router.get('/show/:id', function(req, res, next) {
  var dbs = req.db;
  var posts = dbs.get('posts');
  var id = req.params.id;

  posts.findById(id, function(err, data) {
    res.render('show', {
      "post": data
    });
  });

});

router.get('/add', function(req, res, next) {
  var dbs = req.db;
  var categories = dbs.get('categories');

  categories.find({}, {}, function(err, categories) {
    res.render('addpost', {
      "title": "Add Post",
      "categories": categories
    });
  });

});

router.post('/add', function(req, res, next) {
  var dbs = req.db;
  // get the form values
  var title     = req.body.title;
  var body      = req.body.body;
  var category  = req.body.category;
  var author    = req.body.author;
  var date      = new Date();

  // Check if 'form' input data is valid
  if (req.files.mainimage) {
    var mainImageOriginalName = req.files.mainimage.originalname;
    var mainImageName = req.files.mainimage.name;
    var mainImageMime = req.files.mainimage.mimetype;
    var mainImagePath = req.files.mainimage.path;
    var mainImageExt = req.files.mainimage.extension;
    var mainImageSize = req.files.mainimage.size;
  }
  else {
    var mainImageName = 'noimage.png';
  }

  // Form validation
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('body', 'Body field is required');

  // Check errors
  var errors = req.validationErrors();

  if (errors) {
    res.render('addpost', {
      "errors": errors,
      "title": title,
      "body": body
    });
  } else {
    var posts = dbs.get('posts');

    // Insert into database
    posts.insert({
      "title": title,
      "body": body,
      "category": category,
      "date": date,
      "author": author,
      "mainimage": mainImageName
    }, function(err, data) {
      if (err) {
        res.send('Issue submitting a post');
      } else {
        req.flash('success', 'Post submitted');
        res.location('/');
        res.redirect('/');
      }
    });

  }


});

module.exports = router;
