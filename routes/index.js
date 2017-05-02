var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var auth = require('../models/auth');
// localhost/:name of the db

/* Homepage blog posts */
router.get('/', auth.ensureAuthenticated, function(req, res, next) {
  var dbs = req.db;
  var posts = dbs.get('posts');
  posts.find({}, {}, function(err, data) {
    if (err) throw err;

    res.render('index', {
      posts: data
    });
  });
});

module.exports = router;
