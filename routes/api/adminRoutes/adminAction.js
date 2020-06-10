const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../../../models/User');
const Profile = require('../../../models/Profile');
const adminAuth = require('../../../middleware/adminAuth');
const Admin = require('../../../models/adminModels/Admin');
const {check, validationResult} = require('express-validator');

// @route   GET api/adminAction/getAllUsers
// @desc    Getting all the users data
// @access  Private
router.get('/getAllUsers', adminAuth, async (req, res) => {
    try {
        // Get all users from data-base
        const users = await User.find().select('-password');
        if (!users) {
            res.send(400).json({errors: [{msg: 'There are no users'}]});
        }
        const admin = await Admin.findById(req.admin.id).select('-password');
        const resJson = {
            users,
            permissions: admin.permissions
        };
        res.json(resJson);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/adminAction/updateUserInfo
// @desc    Update user info via admin
// @access  Private
router.put('/updateUserInfo', [adminAuth,[
    check('userId', 'Please a userId').notEmpty(),
    check('mobileNumber', 'Please enter a valid 10 digit mobile number').isMobilePhone('en-IN')
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {userId, mobileNumber, currentAddress, permanentAddress} = req.body;

    if (!(mobileNumber || currentAddress || permanentAddress)) {
        return res.status(400).json({errors: [{msg: 'Please try updating anyone field'}]});
    }

    try {
        const users = await User.find().select('-password');
        const userIdsArray = users.map(item => (item._id).toString());    // TODO issue might come here toString()

        // Checking if userId sent in request body is valid or not
        if (!userIdsArray.includes(userId)) {
            return res.status(400).json({errors: [{msg: 'User cannot be updated or this user is unavailable'}]});
        }

        // If valid then update the information
        const getProfile = await Profile.findOne({ user: userId }).populate('user', ['mobileNumber']);
        console.log(getProfile);
        if (mobileNumber === getProfile.user.mobileNumber ||
            currentAddress === getProfile.currentAddress ||
            permanentAddress === getProfile.permanentAddress) {
            return res.status(400).json({errors: [{
                msg:'Mobile-number/Current-address/Permanent-address is already up to date'}]
            });
        }
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { mobileNumber },
            { new: true }
        );
        await user.save();

        if (currentAddress) {
            const profile = await Profile.findOneAndUpdate(
                { user: userId },
                { currentAddress },
                { new: true }
            );
            profile.date.push(moment());
            await profile.save();
        }

        if (permanentAddress) {
            const profile = await Profile.findOneAndUpdate(
                { user: userId },
                { permanentAddress },
                { new: true }
            );
            profile.date.push(moment());
            await profile.save();
        }
        return res.json({ success: `Updated ${getProfile.firstName}'s data.` });
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;