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
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    customerId: {
        type: Number,
        default: Number(Math.floor(100000000 + Math.random() * 900000000)),
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

module.exports = User = mongoose.model('user', UserSchema);
