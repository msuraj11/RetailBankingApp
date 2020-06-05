const mongoose = require('mongoose');

const TransactionsSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    accountBalance: {
        type: Number
    },
    txDetails: [
        {
            txType: {
                type: String,
                required: true
            },
            txAmount: {
                type: Number,
                required: true
            },
            txDates: {
                type: Date
            },
            currentBalance: {
                type: Number
            },
            txId: {
                type: String,
                unique: true
            }
        }
    ]
});

module.exports = Transactions = mongoose.model('transactions', TransactionsSchema);
