
// Ensure user is authenticated before proceeding to
// - Main page
// - Adding posts
// - Adding categories
// - Adding comments
var passwordValidator = require('password-validator');

module.exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports.validatePassword = function(param) {
  // Creating a schema for password validation
  var schema = new passwordValidator();

  // Adding properties to it
  schema
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  .has().symbols();                               // Has symbols

  // Validate against a password string
  return schema.validate(param);
}
