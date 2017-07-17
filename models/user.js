// USER MODEL - - - - - - - - - - - - - - -
// monk instead of mongoose
var bcrypt = require('bcrypt');
require('dotenv').config()

var MONGODB_URI = process.env.MONGODB_URI;
var dbs = require('monk')(MONGODB_URI);
var ObjectID = require('monk').id;
var User = dbs.get('users');

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
}

module.exports.getUserById = function(id) {
  return new Promise((resolve, reject) => {
      User.findOne({ _id: id })
        .then(doc => {
            resolve(doc);
        })
        .catch(error => {
            reject(error);
        });
  });
}

module.exports.getUserByUsername = function(username, callback) {
  var query = {
    username: username
  };
  console.log(`getting by username;`);
  User.findOne(query, {}, callback);
}

module.exports.checkUserExistence = function(user, callback) {
  User.findOne( { $or: [ { username: user.username }, { email: user.email } ] }, {}, callback);
}

module.exports.createUser = function(newUser, callback) {
  bcrypt.hash(newUser.password, 10, function(err, hash) {
    if (err) throw err;
    // Set hashed password
    newUser.password = hash;
    // Create user
    callback(null, newUser);
  });
}

module.exports.insertUser = function(userQuery) {
  User.insert(userQuery, (err, res) => {
    // Handle errors first (if they're present)
    if (err) {
      throw err;
    }
    else {
      console.log("User added");
    }
  });
}
