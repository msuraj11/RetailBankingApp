const express = require('express');
const router = express.Router();
const moment = require('moment');
const crypto = require('crypto');
const auth = require('../../middleware/auth');
const Transactions = require('../../models/Transactions');
const {check, validationResult} = require('express-validator');

// @route   POST api/transactions
// @desc    For transaction of money
// @access  Private
router.post('/', [auth, [
    check('txAmount', 'Please add some amount to open account').notEmpty().isNumeric(),
    check('txType', 'Please select Credited or Debited').notEmpty()
]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {txAmount, txType} = req.body;

        try {
            const txnsProfile = await Transactions.findOne({ profile: req.profile.id });

            if (!txnsProfile) {
                return res.status(400).json({ msg: 'There is no profile for this user' });
            }

            if (txType === 'Debited') {

                if ((txnsProfile.accountBalance && txnsProfile.accountBalance === 0) ||
                    (txAmount > txnsProfile.accountBalance) ) {
                    return res.status(400).json({ msg: 'There is no sufficient balance in your account to complete this transaction.' });
                }

                if (txAmount && txAmount > 0) {
                    const txs = await Transactions.findOneAndUpdate(
                        { profile: req.profile.id },
                        { accountBalance: (txs.accountBalance - txAmount).toFixed(2) },
                        { new: true });
    
                    txs.txDetails.unshift({
                        txType,
                        txAmount: -txAmount,
                        txDates: moment(),
                        currentBalance: txs.accountBalance,
                        txId: crypto.randomBytes(20).toString('hex')
                    });
    
                    await txs.save();
                    return res.json(txs);
                }
            }

            if (txType === 'Credited' && txAmount && txAmount > 0) {
                const txs = await Transactions.findOneAndUpdate(
                    { profile: req.profile.id },
                    { accountBalance: (txs.accountBalance !== null ?
                        txs.accountBalance + txAmount : 0+txAmount).toFixed(2) },
                    { new: true });

                txs.txDetails.unshift({
                    txType,
                    txAmount,
                    txDates: moment(),
                    currentBalance: txs.accountBalance,
                    txId: crypto.randomBytes(20).toString('hex')
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