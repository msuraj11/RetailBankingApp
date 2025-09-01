import express from 'express';
import moment from 'moment';
import {check, validationResult} from 'express-validator';

import authMiddleware from '../../middleware/auth.js';
import Profile from '../../models/Profile.js';
import Transactions from '../../models/Transactions.js';

const router = express.Router();

// @route   POST api/transactions
// @desc    For transaction of money
// @access  Private
router.post(
  '/',
  [
    authMiddleware,
    [
      check('txAmount', 'Please add some amount to open account').notEmpty().isNumeric(),
      check('txType', 'Please select Credited or Debited').notEmpty(),
      check('txBy', 'Please provide mode of transaction').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {txAmount, txType, txBy} = req.body;

    if (txAmount <= 0) {
      return res.status(400).json({errors: [{msg: 'Add a valid positive amount'}]});
    }

    try {
      // Here profile is used to fetch account number hence it is mandatory
      const profile = await Profile.findOne({user: {$eq: req.user.id}});
      if (!profile) {
        return res.status(400).json({
          errors: [
            {msg: 'There is no profile for this user. Please do KYC and perform transactions'}
          ]
        });
      }

      const isPrevTransaction = await Transactions.findOne({user: {$eq: req.user.id}});
      // First transaction initializing accountBalance: 0. so that it is not null
      // Also keeping accNumber initialised at once and updating only required ones
      if (!isPrevTransaction) {
        const setTransaction = new Transactions({
          accNumber: profile.accountNumber,
          accountBalance: 0,
          txDetails: [],
          user: req.user.id
        });
        await setTransaction.save();
      }

      // Again fetching updated tranactions after updating above
      // This is mainly for first transaction purpose to fetch again
      const getTransactionDetails = await Transactions.findOne({user: {$eq: req.user.id}});

      if (txType === 'Debited') {
        if (
          getTransactionDetails.accountBalance === 0 ||
          txAmount > getTransactionDetails.accountBalance
        ) {
          return res.status(400).json({
            errors: [
              {
                msg: 'There is no sufficient balance in your account to complete this transaction.'
              }
            ]
          });
        }

        if (txAmount && txAmount > 0) {
          const txs = await Transactions.findOneAndUpdate(
            {user: {$eq: req.user.id}},
            {accountBalance: (getTransactionDetails.accountBalance - txAmount).toFixed(2)},
            {new: true}
          );

          txs.txDetails.unshift({
            txType,
            txAmount: -txAmount,
            txDates: moment(),
            txBy,
            currentBalance: txs.accountBalance
          });

          await txs.save();
          return res.json(txs);
        }
      }

      if (txType === 'Credited' && txAmount && txAmount > 0) {
        const txs = await Transactions.findOneAndUpdate(
          {user: {$eq: req.user.id}},
          {accountBalance: (getTransactionDetails.accountBalance + txAmount).toFixed(2)},
          {new: true}
        );

        txs.txDetails.unshift({
          txType,
          txAmount,
          txDates: moment(),
          txBy,
          currentBalance: txs.accountBalance
        });

        await txs.save();
        return res.json(txs);
      }

      if (!['Credited', 'Debited'].includes(txType)) {
        return res.status(400).json({errors: [{msg: 'Please give a valid Transaction type'}]});
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

export default router;
