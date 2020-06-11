const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../../../models/User');
const Profile = require('../../../models/Profile');
const Transactions = require('../../../models/Transactions');
const adminAuth = require('../../../middleware/adminAuth');
const Admin = require('../../../models/adminModels/Admin');

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
router.put('/updateUserInfo', adminAuth, async (req, res) => {
    const {userId, mobileNumber, currentAddress, permanentAddress} = req.body;

    if (!(mobileNumber || currentAddress || permanentAddress)) {
        return res.status(400).json({errors: [{msg: 'Please try updating anyone field'}]});
    }

    const mobRegX = /^((\+){1}91){1}[1-9]{1}[0-9]{9}$/ ;
    if (mobileNumber && !mobRegX.test(mobileNumber)) {
        return res.status(400).json({errors: [{msg: 'Please provide a valid mobile number.'}]});
    }

    try {
        const admin = await Admin.findById(req.admin.id);
        if (admin.permissions.length < 2) {
            return res.status(400).json({msg: 'Permission denied'});
        }

        const users = await User.find().select('-password');
        const userIdsArray = users.map(item => (item._id).toString());    // TODO issue might come here toString()

        // Checking if userId sent in request body is valid or not
        if (!userId || !userIdsArray.includes(userId)) {
            return res.status(400).json({errors: [{msg: 'User not found'}]});
        }

        // If valid then update the information
        const getProfile = await Profile.findOne({ user: userId }).populate('user', ['mobileNumber']);
        if (!getProfile) {
            return res.status(400).json({errors: [
                {msg: 'Profile not found'} ]});
        }

        if (mobileNumber === getProfile.alternateContactNumber) {
            return res.status(400).json({errors: [
                {msg: 'Mobile number and alternate contact number cannot be same'} ]});
        }

        if (mobileNumber === getProfile.user.mobileNumber ||
            currentAddress === getProfile.currentAddress ||
            permanentAddress === getProfile.permanentAddress) {
            return res.status(400).json({errors: [{
                msg:'Mobile-number/Current-address/Permanent-address is already up to date'}]
            });
        }
        
        if (mobileNumber) {
            await User.findOneAndUpdate(
                { _id: userId },
                { mobileNumber },
                { new: true }
            );
            getProfile.date.push({
                lastUpdated: moment(),
                updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Mobile-number`
            });
            await getProfile.save();
        }

        if (currentAddress) {
            const profile = await Profile.findOneAndUpdate(
                { user: userId },
                { currentAddress },
                { new: true }
            );
            profile.date.push({
                lastUpdated: moment(),
                updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Current Address`
            });
            await profile.save();
        }

        if (permanentAddress) {
            const profile = await Profile.findOneAndUpdate(
                { user: userId },
                { permanentAddress },
                { new: true }
            );
            profile.date.push({
                lastUpdated: moment(),
                updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Permanent Address`
            });
            await profile.save();
        }
        return res.json({ success: `Updated ${getProfile.firstName}'s data.` });
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/adminAction/deleteUser/:user_id
// @desc    Delete the user and it's data
// @access  Private
router.delete('/deleteUser/:user_id', adminAuth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        if (admin.permissions.length < 3) {
            return res.status(400).json({msg: 'Permission denied'});
        }

        const {user_id} = req.params;
        const user = await User.findById(user_id);
        const profile = await Profile.findOne({user: user_id});
        const transactions = await Transactions.findOne({user: user_id});

        await User.findByIdAndRemove({ _id: user_id });

        if (profile) {
            await Profile.findOneAndRemove({ user: user_id });
        }
        if (transactions) {
            await Transactions.findOneAndRemove({ user: user_id });
        }

        return res.json({ success: `Deleted ${user.name}'s data.` })
    } catch (err) {
        console.log(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({msg: 'User not found'});
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;