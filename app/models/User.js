/**
 *  Sample model
 */

var bella = require('bellajs');
var crypto = require('crypto');
var Promise = require('promise-wtf');

var User = require('./schemas/User');

var encrypt = (pass, salt = '') => {
  if (!salt) {
    salt = bella.createId(10);
  }
  var hash = crypto.createHmac('sha512', salt);
  hash.update(pass);
  return {
    hash: hash.digest('hex'),
    salt
  };
};

var create = (data) => {
  return new Promise((resolve, reject) => {

    let u = new User(data);

    u.userid = bella.createId(24);
    u.createdAt = bella.time();

    // encrypt password
    let p = encrypt(data.password);
    u.salt = p.salt;
    u.hash = p.hash;

    u.save((err) => {
      if (err) {
        return reject(err);
      }
      return resolve(u);
    });
  });

};

module.exports = {
  create
};
