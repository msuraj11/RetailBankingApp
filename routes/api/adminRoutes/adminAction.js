const express = require('express');
const router = express.Router();
const User = require('../../../models/User');
const Profile = require('../../../models/Profile');
const adminAuth = require('../../../middleware/adminAuth');
const Admin = require('../../../models/adminModels/Admin');


// @route   GET api/adminAction/getAllUsers
// @desc    Getting all the users data
// @access  Private
router.get('/getAllUsers', adminAuth, async (req, res) => {
    try {
        const allUsers = await User.find();
        const users = allUsers.map(item => {
            delete item.password;
            return item;
        });
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
// @desc    Update user info
// @access  Private
router.put('/updateUserInfo', adminAuth, async (req, res) => {
    const {userId, mobileNumber, currentAddress, permanentAddress} = req.body;
    try {
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
            await profile.save();
        }

        if (permanentAddress) {
            const profile = await Profile.findOneAndUpdate(
                { user: userId },
                { permanentAddress },
                { new: true }
            );
            await profile.save();
        }
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});