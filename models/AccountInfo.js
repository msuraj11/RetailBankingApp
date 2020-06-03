const mongoose = require('mongoose');

const AccountInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    toDate: {
        type: Date
    },
    fromDate: {
        type: Date
    }
});

module.exports = AccountInfo = mongoose.model('accountInfo', AccountInfoSchema);
