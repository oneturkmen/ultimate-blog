var express = require('express');
var router = express.Router();

// Models
var auth = require('../models/auth');

router.get('/', auth.ensureAuthenticated, function(req, res, next) {
  res.render('chat', {
    title: 'Chat'
  });
});

router.post('/', auth.ensureAuthenticated, function(req, res, next) {
  
});

module.exports = router;
