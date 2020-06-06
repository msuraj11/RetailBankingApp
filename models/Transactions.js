const mongoose = require('mongoose');

const TransactionsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    accountBalance: {
        type: Number
    },
    accNumber: {
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
            }
        }
    ]
});

module.exports = Transactions = mongoose.model('transactions', TransactionsSchema);
