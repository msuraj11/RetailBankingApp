const express = require('express');
const router = express.Router();
const moment = require('moment');
const auth = require('../../middleware/auth');
const Transactions = require('../../models/Transactions');
const Profile = require('../../models/Profile');
const {check, validationResult} = require('express-validator');

// @route   POST api/transactions
// @desc    For transaction of money
// @access  Private
router.post('/', [auth, [
    check('txAmount', 'Please add some amount to open account').notEmpty().isNumeric(),
    check('txType', 'Please select Credited or Debited').notEmpty(),
    check('txBy', 'Please provide mode of transaction').notEmpty()
]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {txAmount, txType, txBy} = req.body;

        if (txAmount <= 0) {
            return res.status(400).json({errors: [ {msg: 'Add a valid positive amount'} ]});
        }
        
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            if (!profile) {
                return res.status(400).json({ msg: 'There is no profile for this user. Please do KYC and perform transactions' });
            }

            const isPrevTransaction = await Transactions.findOne({ user: req.user.id });
            if (!isPrevTransaction) {
                const setTransaction = new Transactions({
                    accNumber: profile.accountNumber,
                    accountBalance: 0,
                    txDetails: [],
                    user: req.user.id,
                });
                await setTransaction.save();
            }

            const getTransactionDetails = await Transactions.findOne({ user: req.user.id });

            if (txType === 'Debited') {

                if ((getTransactionDetails.accountBalance === 0) || (txAmount > getTransactionDetails.accountBalance) ) {
                    return res.status(400).json({ msg: 'There is no sufficient balance in your account to complete this transaction.' });
                }

                if (txAmount && txAmount > 0) {
                    const txs = await Transactions.findOneAndUpdate(
                        { user: req.user.id },
                        { accountBalance: (getTransactionDetails.accountBalance - txAmount).toFixed(2) },
                        { new: true });
    
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
                    { user: req.user.id },
                    { accountBalance: (getTransactionDetails.accountBalance + txAmount).toFixed(2) },
                    { new: true });

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
                return res.status(400).json({ msg: 'Please give a valid Transaction type' });
            }
            
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;