const mongoose = require('mongoose');
const moment = require('moment');

const AdminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    personalEmail: {
        type: String,
        required: true,
        unique: true
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
    permissions: {
        type: [String],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    adminBranch: {
        type: String,
        required: true
    },
    adminId: {
        type: Number, // TODO adminId concat with branch and bank-name
        default: Number(Math.floor(10000000 + Math.random() * 90000000)),
        unique: true
    },
    avatar: {
        type: String
    },
    regDate: {
        type: Date,
        default: moment()
    }
});

module.exports = Admin = mongoose.model('admin', AdminSchema);
