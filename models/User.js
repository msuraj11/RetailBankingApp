const mongoose = require('mongoose');
const moment = require('moment');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  customerId: {
    type: Number,
    unique: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: moment()
  }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
