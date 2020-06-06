const express = require('express');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Transactions = require('../../models/Transactions');
const AccountInfo = require('../../models/AccountInfo');

const router = express.Router();

// @route   GET api/accountInfo
// @desc    This is to get the account Info
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const profile =  await Profile.findOne({ user: req.user.id });
        const transactions = await Transactions.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(400)
            .json({ msg: 'There is no profile for this user. Please do KYC to get Account Information' });
        }

        const {accountNumber: accNo, accountType: accType, firstName, lastName,
            IFSC_Code: IFSC, accBranch: branch} = profile;
        const {accountBalance: totalAccBalance} = transactions;

        let isAccountInfoUpdated = await AccountInfo.findOne({ user: req.user.id });
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
            res.json(accountInformation);
        }
        
        isAccountInfoUpdated = await AccountInfo.findOneAndUpdate(
                {user: req.user.id},
                {totalAccBalance},
                {new: true}
            );
        
        await isAccountInfoUpdated.save();
        res.json(isAccountInfoUpdated);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
