const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);

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
    check('contactEmailID', 'Please include a valid email').isEmail(),
    check('mobileNumber', 'Please enter a valid 10 digit mobile number').isMobilePhone('en-IN'),
    check('sourceOfIncome', 'Please fill this field').not().isEmpty(),
    check('occupation', 'Please fill this field').not().isEmpty(),
    check('accountType', 'Please choose an account type').notEmpty(),
    check('addAmount', 'Please add minimum of 1000 rupees').notEmpty().isNumeric().isLength({min: 4})
]], async (req, res) => {

        const {firstName, lastName, PANCardNo, AadharNo, currentAddress, contactEmailID, permanentAddress,
            mobileNumber, sourceOfIncome, occupation, company, accountType, addAmount, fatherName,
            motherName, spouse} = req.body;

        const profileFields = {firstName, lastName, PANCardNo, AadharNo, currentAddress, contactEmailID,
            permanentAddress, mobileNumber, sourceOfIncome, occupation, company, accountType, addAmount,
            familyDetails: {
                fatherName,
                motherName,
                spouse
            },
            user: req.user.id
        };

        try { 

                let profiler = await Profile.findOne({ user: req.user.id });
                console.log(profiler);
                if (profiler) {
                    if (currentAddress && profiler.currentAddress !== currentAddress) {
                        profiler = await Profile.findOneAndUpdate(
                            { user: req.user.id },
                            { currentAddress },
                            { new: true }
                        );
                    }
                    if (addAmount && addAmount > 0) {
                        profiler = await Profile.findOneAndUpdate(
                            { user: req.user.id },
                            { addAmount: profiler.addAmount + addAmount },
                            { new: true }
                        );
                    } else if (addAmount <= 0) {
                        return res.status(400).json({errors: [ {msg: 'Add a valid positive amount'} ]});
                    }

                    return res.json(profiler);
                }

                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                profiler = await Profile.findOne({ PANCardNo });
                if (profiler) {
                    return res.status(400).json({errors: [
                        {msg: 'PAN card number already exist by some user. Please enter a valid one'} ]});
                }

                profiler = await Profile.findOne({ AadharNo });
                if (profiler) {
                    return res.status(400).json({errors: [
                        {msg: 'Aadhar card number already exist by some user. Please enter a valid one'} ]});
                }

                profiler = await Profile.findOne({ contactEmailID });
                if (profiler) {
                    return res.status(400).json({errors: [ {msg: 'Please try with new E-mail ID'} ]});
                }

                profiler = await Profile.findOne({ mobileNumber });
                if (profiler) {
                    return res.status(400).json({errors: [
                        {msg: 'This number is already registered. Please try with new Number'} ]});
                }

                profiler = new Profile(profileFields);
                await profiler.save();
                
                return res.json(profiler);
        } catch(err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
});

module.exports = router;
