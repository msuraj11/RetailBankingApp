const mongoose = require('mongoose');

const AccountInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    totalAccBalance: {
        type: Number
    },
    accNo: {
        type: Number
    },
    accType: {
        type: String
    },
    accHolder: {
        type: String
    },
    IFSC: {
        type: String
    },
    branch: {
        type: String
    }
});

module.exports = AccountInfo = mongoose.model('accountInfo', AccountInfoSchema);
