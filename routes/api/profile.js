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
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar', 'customerId', 'mobileNumber']);

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
    check('accountType', 'Please choose an account type').notEmpty()
]], async (req, res) => {

        const {firstName, lastName, PANCardNo, AadharNo, currentAddress, permanentAddress,
            alternateContactNumber, sourceOfIncome, occupation, company, fatherName, accountType,
            motherName, spouse} = req.body;

        const profileFields = {firstName, lastName, PANCardNo, AadharNo, currentAddress, permanentAddress,
            alternateContactNumber, sourceOfIncome, occupation, company, accountType,
            familyDetails: {
                fatherName,
                motherName,
                spouse
            },
            user: req.user.id
        };

        try { 
                // Check if Profile is already built for user, then only we can update
                // the current address and add some amount to the account
                let profiler = await Profile.findOne({ user: req.user.id });

                if (profiler) {
                    if (currentAddress && profiler.currentAddress !== currentAddress) {
                        profiler = await Profile.findOneAndUpdate(
                            { user: req.user.id },
                            { currentAddress },
                            { new: true }
                        );
                    }
                    profiler = await Profile.findOneAndUpdate(
                        { user: req.user.id },
                        { date: moment() },
                        { new: true }
                    );

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

                // Check if user mobile number and alternate contact are same
                const user = await User.findById(req.user.id).select('-password');
                if (user.mobileNumber === profileFields.alternateContactNumber) {
                    return res.status(400).json({errors: [
                        {msg: 'Mobile number and alternate contact number cannot be same'} ]});
                }

                // If everything is alright then creating an instance of Profile as profiler and saving in database
                profiler = new Profile(profileFields);
                await profiler.save();
                
                return res.json(profiler);
        } catch(err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
});

module.exports = router;
