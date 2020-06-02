const mongoose = require('mongoose');

const ProfileScema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    PANCardNo: {
        type: String,
        required: true,
        unique: true
    },
    AadharNo: {
        type: Number,
        required: true,
        unique: true
    },
    currentAddress: {
        type: String,
        required: true
    },
    permanentAddress: {
        type: String
    },
    contactEmailID: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    sourceOfIncome: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    familyDetails: {
        fatherName: {
            type: String
        },
        motherName: {
            type: String
        },
        spouseName: {
            type: String
        }
    },
    accountType: {
        type: String,
        required: true
    },
    addAmount: {
        type: Number,
        required: true
    },
    accountNumber: {
        type: Number,
        default: Number('56010'+Math.floor(10000 + Math.random() * 90000)),
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    txDate: {
        type: Date
    }
});

module.exports = Profile = mongoose.model('profile', ProfileScema);
