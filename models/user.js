// USER MODEL - - - - - - - - - - - - - - -
// monk instead of mongoose
var bcrypt = require('bcrypt');
var dbs = require('monk')('localhost/nodeblog');
var User = dbs.get('users');

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  var query = {
    username: username
  };
  User.findOne(query, {}, callback);
}

module.exports.createUser = function(newUser, callback) {
  bcrypt.hash(newUser.password, 10, function(err, hash) {
    if (err) throw err;
    // Set hashed password
    // FIXME: After user created, insert into the database.
    newUser.password = hash;
    // Create user
    newUser.save(callback);
  });
}
