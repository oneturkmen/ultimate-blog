var express = require('express');
var router = express.Router();
var app = express();
// Models
var auth = require('../models/auth');

router.get('/', auth.ensureAuthenticated, function(req, res, next) {
  console.log(`I am here ${req.user.username}`);
  res.render('chat', {
    title: 'Chat',
    user: req.user.username
  });
});

module.exports = router;
