const express = require('express');
const moment = require('moment');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Transactions = require('../../models/Transactions');
const AccountInfo = require('../../models/AccountInfo');

const router = express.Router();

// @route   GET api/accountInfo/statement/:start_date/:end_date
// @desc    To get account statement from day to day
// @access  Private
router.get('/statement/:start_date/:end_date', auth, async (req, res) => {
    try {
        const transactions = await Transactions.findOne({ user: req.user.id });
        const {txDetails} = transactions;
        const {start_date, end_date} = req.params;

        if (!(moment(start_date).isValid() && moment(end_date).isValid())) {
            return res.status(400).json({ msg: 'Please provide valid dates' });
        }

        const filteredTxDetails = txDetails.filter(item => {
            return moment(item.txDates).isBetween(start_date, end_date);
        });
        if (filteredTxDetails.length === 0) {
            return res.status(400).json({ msg: 'There are no transsactions in these dates' });
        }
        return res.json(filteredTxDetails);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/accountInfo
// @desc    This is to get the account Info
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const profile =  await Profile.findOne({ user: req.user.id });
        const transactions = await Transactions.findOne({ user: req.user.id });

        // Here profile is mandatory to show User's data
        if (!profile) {
            return res.status(400)
            .json({ msg: 'There is no profile for this user. Please do KYC to get Account Information' });
        }

        const {accountNumber: accNo, accountType: accType, firstName, lastName,
            IFSC_Code: IFSC, accBranch: branch} = profile;
        const {accountBalance: totalAccBalance} = transactions;

        // Already fetched this API anytime before? then just update the accountBalance
        // If it's not fetched then creating new instance in data-base
        let isAccountInfoUpdated = await AccountInfo.findOne({ user: req.user.id });
        // First fetch
        if (!isAccountInfoUpdated) {
            const accountInformation = new AccountInfo({
                user: req.user.id,
                totalAccBalance: transactions ? totalAccBalance : 0,
                accNo,
                accType,
                accHolder: `${firstName} ${lastName}`,
                IFSC,
                branch
            });
    
            await accountInformation.save();
            return res.json(accountInformation);
        }
        
        // Already fetched/ updated
        isAccountInfoUpdated = await AccountInfo.findOneAndUpdate(
                {user: req.user.id},
                {totalAccBalance},
                {new: true}
            );
        
        await isAccountInfoUpdated.save();
        return res.json(isAccountInfoUpdated);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
