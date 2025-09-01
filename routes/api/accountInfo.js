import express from 'express';
import moment from 'moment';

import authMiddleware from '../../middleware/auth.js';
import Profile from '../../models/Profile.js';
import Transactions from '../../models/Transactions.js';

const router = express.Router();

// @route   GET api/accountInfo/statement/:start_date/:end_date
// @desc    To get account statement from day to day
// @access  Private
router.get('/statement/:start_date/:end_date', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transactions.findOne({user: {$eq: req.user.id}});
    if (!transactions) {
      return res.status(400).json({msg: 'There are no transactions'});
    }
    const {txDetails} = transactions;
    const {start_date, end_date} = req.params;

    if (!(moment(start_date).isValid() && moment(end_date).isValid())) {
      return res.status(400).json({msg: 'Please provide valid dates'});
    }

    const filteredTxDetails = txDetails.filter((item) => {
      return moment(moment(item.txDates).format('YYYY-MM-DD')).isBetween(
        start_date,
        end_date,
        undefined,
        []
      );
    });
    if (filteredTxDetails.length === 0) {
      return res.status(400).json({msg: 'There are no transactions in these dates'});
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
router.get('/', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: {$eq: req.user.id}});
    const transactions = await Transactions.findOne({user: {$eq: req.user.id}});

    // Here profile is mandatory to show User's data
    if (!profile) {
      return res
        .status(400)
        .json({msg: 'There is no profile for this user. Please do KYC to get Account Information'});
    }

    const {accountNumber, accountType, firstName, lastName, IFSC_Code, accBranch} = profile;
    const accountBalance = transactions ? transactions.accountBalance : 0;

    const accountInfo = {
      accountNumber,
      accountType,
      accountBalance,
      accHolder: `${firstName} ${lastName}`,
      IFSC_Code,
      accBranch
    };
    res.json(accountInfo);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
