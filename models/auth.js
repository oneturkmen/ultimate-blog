
// Ensure user is authenticated before proceeding to
// - Main page
// - Adding posts
// - Adding categories
// - Adding comments

module.exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}
