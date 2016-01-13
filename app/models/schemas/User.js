var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  userid: {
    type: String,
    unique: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    index: true,
    lowercase: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  birthday: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  nationality: {
    type: String,
    default: ''
  },
  hash: {
    type: String,
    default: ''
  },
  salt: {
    type: String,
    default: ''
  },
  status: {
    type: Number,
    default: 1
  }, // 1 = unactivated, 2 = activated
  group: {
    type: String,
    default: 'user'
  },
  updatedAt: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('User', UserSchema);
