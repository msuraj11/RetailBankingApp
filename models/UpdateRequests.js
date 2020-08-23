const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    profileId: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String
    },
    permanentAddress: {
        type: String
    },
    spouseName: {
        type: String
    },
    alternateContactNumber: {
        type: String
    },
    occupation: {
        type: String
    },
    sourceOfIncome: {
        type: String
    },
    company: {
        type: String
    },
    submittedOn: {
        type: Date,
        required: true
    }
});

module.exports = UpdateRequests = mongoose.model('update_requests', RequestSchema);
