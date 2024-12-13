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
  gender: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  PANCardNo: {
    type: String,
    required: true,
    unique: true
  },
  AadharNo: {
    type: String,
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
  alternateContactNumber: {
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
  accBranch: {
    type: String,
    required: true
  },
  IFSC_Code: {
    type: String,
    required: true
  },
  accountNumber: {
    type: Number,
    default: Number('56010' + Math.floor(10000 + Math.random() * 90000)),
    unique: true
  },
  date: [
    {
      lastUpdated: {
        type: Date,
        required: true
      },
      updatedBy: {
        type: String,
        required: true
      }
    }
  ]
});

const Profile = mongoose.model('profile', ProfileScema);

module.exports = Profile;
