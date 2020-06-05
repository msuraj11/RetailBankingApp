const express = require('express');
const router = express.Router();
const moment = require('moment');
const crypto = require('crypto');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar', 'customerId']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create or Update a user profile
// @access  Private
router.post('/', [auth, [
    check('firstName', 'Please provide First-name').not().isEmpty(),
    check('lastName', 'Please provide Last-name').not().isEmpty(),
    check('PANCardNo', 'Please provide a valid PAN Card Number').isLength({min: 10, max:10}),
    check('AadharNo', 'Please provide a valid Aadhar Card Number').isNumeric().isLength({min: 12, max:12}),
    check('currentAddress', 'Please provide your current location address').not().isEmpty(),
    check('alternateContactNumber', 'Please enter a valid 10 digit mobile number').isMobilePhone('en-IN'),
    check('sourceOfIncome', 'Please fill this field').not().isEmpty(),
    check('occupation', 'Please fill this field').not().isEmpty(),
    check('accountType', 'Please choose an account type').notEmpty(),
    check('txAmount', 'Please add some amount to open account').notEmpty().isNumeric()
]], async (req, res) => {

        const {firstName, lastName, PANCardNo, AadharNo, currentAddress, permanentAddress,
            alternateContactNumber, sourceOfIncome, occupation, company, accountType, txAmount, fatherName,
            motherName, spouse} = req.body;

        const profileFields = {firstName, lastName, PANCardNo, AadharNo, currentAddress, permanentAddress,
            alternateContactNumber, sourceOfIncome, occupation, company, accountType,
            accountBalance: 0+txAmount,
            familyDetails: {
                fatherName,
                motherName,
                spouse
            },
            user: req.user.id,
            txDetails: []
        };

        try { 
                // Check if Profile is already built for user, then only we can update
                // the current address and add some amount to thee account
                let profiler = await Profile.findOne({ user: req.user.id });

                if (profiler) {
                    if (currentAddress && profiler.currentAddress !== currentAddress) {
                        profiler = await Profile.findOneAndUpdate(
                            { user: req.user.id },
                            { currentAddress },
                            { new: true }
                        );
                    }
                    if (txAmount && txAmount > 0) {
                        profiler = await Profile.findOneAndUpdate(
                            { user: req.user.id },
                            { accountBalance: (profiler.accountBalance + txAmount).toFixed(2) },
                            { new: true });

                        profiler.txDetails.unshift({
                            txType: 'Credited',
                            txAmount,
                            txDates: moment(),
                            currentBalance: profiler.accountBalance,
                            txId: crypto.randomBytes(20).toString('hex')
                        });

                        await profiler.save();
                        
                    } else if (txAmount <= 0) {
                        return res.status(400).json({errors: [ {msg: 'Add a valid positive amount'} ]});
                    }

                    return res.json(profiler);
                }

                // If JavaScript thread comes here it means profile is'nt built for user
                // Here we are checking for mandatory fields error
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                // Check for unique PAN card number in the whole database
                profiler = await Profile.findOne({ PANCardNo });
                if (profiler) {
                    return res.status(400).json({errors: [
                        {msg: 'PAN card number already exist by some user. Please enter a valid one'} ]});
                }

                // Check for unique Aadhar number in the whole database
                profiler = await Profile.findOne({ AadharNo });
                if (profiler) {
                    return res.status(400).json({errors: [
                        {msg: 'Aadhar card number already exist by some user. Please enter a valid one'} ]});
                }

                // If everything is alright then creating an instance of Profile as profiler and saving in database
                profileFields.txDetails.push({
                    txType: 'Credited',
                    txAmount,
                    txDates: moment(),
                    currentBalance: profileFields.accountBalance,
                    txId: crypto.randomBytes(20).toString('hex')
                });
                profiler = new Profile(profileFields);
                await profiler.save();
                
                return res.json(profiler);
        } catch(err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
});

module.exports = router;
