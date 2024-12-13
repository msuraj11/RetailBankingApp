const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../../../models/User');
const Profile = require('../../../models/Profile');
const Transactions = require('../../../models/Transactions');
const adminAuth = require('../../../middleware/adminAuth');
const Admin = require('../../../models/adminModels/Admin');
const AdminActionLogs = require('../../../models/adminModels/AdminActionLogs');
const {getCleanRequestBody} = require('../../utils/helpers');

// @route   GET api/adminAction/getAllUsers
// @desc    Getting all the users data
// @access  Private
router.get('/getAllUsers', adminAuth, async (req, res) => {
  try {
    // Get all users from data-base
    const profiles = await Profile.find().populate('user', ['mobileNumber', 'avatar']);
    if (!profiles) {
      return res.send(400).json({errors: [{msg: 'There are no users'}]});
    }

    const isAdminLogs = await AdminActionLogs.findOne({admin: {$eq: req.admin.id}});
    if (!isAdminLogs) {
      const adminLogs = new AdminActionLogs({
        admin: req.admin.id,
        logs: []
      });
      await adminLogs.save();
    }

    return res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/adminAction/updateUserInfo
// @desc    Update user info via admin
// @access  Private
router.put('/updateUserInfo', adminAuth, async (req, res) => {
  const {userId, mobileNumber, permanentAddress, spouseName, alternateContactNumber, occupation, sourceOfIncome, company} = getCleanRequestBody(
    req.body
  );

  if (!(mobileNumber || permanentAddress || spouseName || alternateContactNumber || occupation || sourceOfIncome || company)) {
    return res.status(400).json({errors: [{msg: 'Please try updating anyone field'}]});
  }

  const hasInvalidDataInput = [...Object.values(req.body)].filter((fedValue) => typeof fedValue !== 'string').length > 0;

  if (hasInvalidDataInput) {
    return res.status(422).json({errors: [{msg: 'Invalid input type, please provide correct data input.'}]});
  }

  const mobRegX = /^\+91[6-9]\d{9}$/;
  if ((mobileNumber && !mobRegX.test(mobileNumber)) || (alternateContactNumber && !mobRegX.test(alternateContactNumber))) {
    return res.status(400).json({errors: [{msg: 'Please provide a valid mobile number.'}]});
  }

  try {
    const admin = await Admin.findById({$eq: req.admin.id});
    if (admin.permissions.length < 2) {
      return res.status(400).json({msg: 'Permission denied'});
    }

    const users = await User.find().select('-password');
    const userIdsArray = users.map((item) => item._id.toString()); // TODO issue might come here toString()

    // Checking if userId sent in request body is valid or not
    if (!userId || !userIdsArray.includes(userId)) {
      return res.status(400).json({errors: [{msg: 'User not found'}]});
    }

    // If valid then update the information
    const getProfile = await Profile.findOne({user: {$eq: userId}}).populate('user', ['mobileNumber', 'avatar']);
    if (!getProfile) {
      return res.status(400).json({errors: [{msg: 'Profile not found'}]});
    }

    if (mobileNumber === getProfile.alternateContactNumber || alternateContactNumber === getProfile.user.mobileNumber) {
      return res.status(400).json({errors: [{msg: 'Mobile number and alternate contact number cannot be same'}]});
    }

    if (
      mobileNumber === getProfile.user.mobileNumber ||
      (spouseName && spouseName === getProfile.familyDetails.spouseName) ||
      (permanentAddress && permanentAddress === getProfile.permanentAddress) ||
      alternateContactNumber === getProfile.alternateContactNumber ||
      occupation === getProfile.occupation ||
      sourceOfIncome === getProfile.sourceOfIncome ||
      company === getProfile.company
    ) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Mobile-number/Current-address/Permanent-address is already up to date'
          }
        ]
      });
    }

    const userDetails = {
      userAvatar: getProfile.user.avatar,
      accNumber: `${getProfile.accountNumber}`,
      userName: getProfile.firstName,
      userBranch: getProfile.accBranch,
      userIFSC: getProfile.IFSC_Code
    };

    const adminLogs = await AdminActionLogs.findOne({admin: {$eq: req.admin.id}});

    if (mobileNumber) {
      await User.findOneAndUpdate({_id: {$eq: userId}}, {$set: {mobileNumber}}, {new: true});
      getProfile.date.push({
        lastUpdated: moment(),
        updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Mobile-number`
      });
      await getProfile.save();

      adminLogs.logs.unshift({
        actionType: 'UPDATE',
        updatedChanges: `Mobile-number changed from ${getProfile.user.mobileNumber} to ${mobileNumber}`,
        userDetails,
        updatedOn: moment()
      });
      await adminLogs.save();
    }

    if (spouseName) {
      const profile = await Profile.findOneAndUpdate({user: {$eq: userId}}, {$set: {'familyDetails.spouseName': spouseName}}, {new: true});
      profile.date.push({
        lastUpdated: moment(),
        updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Spouse name`
      });
      await profile.save();

      adminLogs.logs.unshift({
        actionType: 'UPDATE',
        updatedChanges: `Spouse name changed from ${getProfile.familyDetails.spouseName} to ${spouseName}`,
        userDetails,
        updatedOn: moment()
      });
      await adminLogs.save();
    }

    if (permanentAddress) {
      const profile = await Profile.findOneAndUpdate({user: {$eq: userId}}, {$set: {permanentAddress}}, {new: true});
      profile.date.push({
        lastUpdated: moment(),
        updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Permanent Address`
      });
      await profile.save();

      adminLogs.logs.unshift({
        actionType: 'UPDATE',
        updatedChanges: `Permanent Address changed from ${getProfile.permanentAddress} to ${permanentAddress}`,
        userDetails,
        updatedOn: moment()
      });
      await adminLogs.save();
    }

    if (alternateContactNumber) {
      const profile = await Profile.findOneAndUpdate({user: {$eq: userId}}, {$set: {alternateContactNumber}}, {new: true});
      profile.date.push({
        lastUpdated: moment(),
        updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Permanent Address`
      });
      await profile.save();

      adminLogs.logs.unshift({
        actionType: 'UPDATE',
        updatedChanges: `Alternate Contact Number changed from ${getProfile.alternateContactNumber} to ${alternateContactNumber}`,
        userDetails,
        updatedOn: moment()
      });
      await adminLogs.save();
    }

    if (occupation) {
      const profile = await Profile.findOneAndUpdate({user: {$eq: userId}}, {$set: {occupation}}, {new: true});
      profile.date.push({
        lastUpdated: moment(),
        updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Permanent Address`
      });
      await profile.save();

      adminLogs.logs.unshift({
        actionType: 'UPDATE',
        updatedChanges: `Occupation changed from ${getProfile.occupation} to ${occupation}`,
        userDetails,
        updatedOn: moment()
      });
      await adminLogs.save();
    }

    if (sourceOfIncome) {
      const profile = await Profile.findOneAndUpdate({user: {$eq: userId}}, {$set: {sourceOfIncome}}, {new: true});
      profile.date.push({
        lastUpdated: moment(),
        updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Permanent Address`
      });
      await profile.save();

      adminLogs.logs.unshift({
        actionType: 'UPDATE',
        updatedChanges: `Source of Income changed from ${getProfile.sourceOfIncome} to ${sourceOfIncome}`,
        userDetails,
        updatedOn: moment()
      });
      await adminLogs.save();
    }

    if (company) {
      const profile = await Profile.findOneAndUpdate({user: {$eq: userId}}, {$set: {company}}, {new: true});
      profile.date.push({
        lastUpdated: moment(),
        updatedBy: `Admin: ${admin.firstName}, id: ${admin.adminId}, item: Permanent Address`
      });
      await profile.save();

      adminLogs.logs.unshift({
        actionType: 'UPDATE',
        updatedChanges: `Company changed from ${getProfile.company} to ${company}`,
        userDetails,
        updatedOn: moment()
      });
      await adminLogs.save();
    }
    return res.json({success: `Updated ${getProfile.firstName}'s data.`});
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/adminAction/deleteUser/:user_id
// @desc    Delete the user and it's data
// @access  Private http://localhost:3000/api/adminAction/deleteUser/60966a80fdbb661dc853e393
router.delete('/deleteUser/:user_id', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById({$eq: req.admin.id});
    if (admin.permissions.length < 3) {
      return res.status(400).json({msg: 'Permission denied'});
    }

    const {user_id} = req.params;
    const user = await User.findById({$eq: user_id});
    const profile = await Profile.findOne({user: {$eq: user_id}});
    const transactions = await Transactions.findOne({user: {$eq: user_id}});
    const adminLogs = await AdminActionLogs.findOne({admin: {$eq: req.admin.id}});

    if (!user) {
      return res.status(400).json({msg: 'User not found'});
    }
    await User.findOneAndRemove({_id: {$eq: user_id}});

    if (profile) {
      await Profile.findOneAndRemove({user: {$eq: user_id}});
    }
    if (transactions) {
      await Transactions.findOneAndRemove({user: {$eq: user_id}});
    }

    adminLogs.logs.unshift({
      actionType: 'DELETE',
      updatedChanges: `Removed ${user.name}'s data.`,
      userDetails: {
        userAvatar: user.avatar,
        accNumber: profile ? `${profile.accountNumber}` : 'Not generated',
        userName: user.name,
        userBranch: profile ? profile.accBranch : 'Not generated',
        userIFSC: profile ? profile.IFSC_Code : 'Not generated'
      },
      updatedOn: moment()
    });
    await adminLogs.save();

    return res.json({success: `Deleted ${user.name}'s data.`});
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({msg: 'User not found'});
    }
    res.status(500).send('Server Error');
  }
});

//@route    GET api/adminAction/logs
//@des      Gets all the admin logs delete/update
//access    Private
router.get('/logs', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById({$eq: req.admin.id});
    if (!admin) {
      return res.status(400).json({msg: 'User not found'});
    }
    if (admin.permissions.length < 2) {
      return res.status(401).json({msg: 'Permission Denied'});
    }
    const adminLogs = await AdminActionLogs.findOne({admin: {$eq: req.admin.id}});
    if (!adminLogs || adminLogs.logs.length === 0) {
      return res.status(400).json({msg: 'There are no logs yet.'});
    }
    return res.json(adminLogs.logs);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
