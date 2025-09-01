import mongoose from 'mongoose';

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
      txBy: {
        type: String,
        required: true
      },
      currentBalance: {
        type: Number
      }
    }
  ]
});

const Transactions = mongoose.model('transactions', TransactionsSchema);

export default Transactions;
