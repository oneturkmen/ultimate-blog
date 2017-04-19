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
  req.checkBody('body', 'Body field is required').notEmpty();

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


router.post('/addcomment', function(req, res, next) {
  var dbs = req.db;
  // get the form values
  var name        = req.body.name;
  var email       = req.body.email;
  var body        = req.body.body;
  var postid      = req.body.postid;
  var commentdate = new Date();
  console.log(name);
  // Form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not formatted correctly').isEmail();
  req.checkBody('body', 'Body field is required').notEmpty();

  // Check errors
  var errors = req.validationErrors();

  if (errors) {
    var posts = dbs.get('posts');

    posts.findById(postid, function(err, data) {
      res.render('show', {
        "errors": errors,
        "post": data
      });
    });

  } else {
    var comment = {
      "name": name,
      "email": email,
      "body": body,
      "commentdate": commentdate
    };

    var posts = dbs.get('posts');

    posts.update(
      {
        "_id": postid
      },
      {
        $push: {
          "comments": comment
        },
      },
      function(err, data) {
        if (err) {
          throw err;
        }
        else {
          req.flash('success', 'Comment Added');
          res.location('/posts/show/' + postid);
          res.redirect('/posts/show/' + postid);
        }
      }
    );
  }

});



module.exports = router;
