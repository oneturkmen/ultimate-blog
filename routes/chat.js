var express = require('express');
var router = express.Router();
var app = express();
// Models
var auth = require('../models/auth');

router.get('/', auth.ensureAuthenticated, function(req, res, next) {
  res.render('chat', {
    title: 'Chat'
  });
});

module.exports = router;
