var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
// localhost/:name of the db

/* Homepage blog posts */
router.get('/', function(req, res, next) {
  var dbs = req.db;
  var posts = dbs.get('posts');
  posts.find({}, {}, function(err, data) {
    console.log(data);
    res.render('index', {
      posts: data
    });
  });
});

module.exports = router;
