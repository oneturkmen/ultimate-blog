var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
// localhost/:name of the db

/* Homepage blog posts */
router.get('/', ensureAuthenticated, function(req, res, next) {
  var dbs = req.db;
  var posts = dbs.get('posts');
  posts.find({}, {}, function(err, data) {
    res.render('index', {
      posts: data
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
