const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');
const Admin = require('../../../models/adminModels/Admin');
const sendEmail = require('../../utils/emailTemplate');
const {getCleanRequestBody} = require('../../utils/helpers');

// @route   POST api/admin
// @desc    Register Admin
// @access  Public
router.post(
  '/',
  [
    check('firstName', 'Please provide First-name').notEmpty(),
    check('lastName', 'Please provide Last-name').notEmpty(),
    check('mobileNumber', 'Please enter a valid 10 digit mobile number').isMobilePhone('en-IN'),
    check('personalEmail', 'Please include a valid email').isEmail(),
    check('experienceInBanking', 'Experience is mandatory').notEmpty().isNumeric(),
    check('gender', 'Please choose any option').notEmpty(),
    check('adminBranch', 'Please provide your branch').notEmpty(),
    check('password', 'Please enter the password with 6 or more characters').isLength({min: 6}),
    check('confirmPassword', 'Please enter the confirm-password same as of password').isLength({min: 6})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    // NoSQL operations should not be vulnerable to injection attacks
    // jssecurity:S5147, CWE fix
    const reqObj = getCleanRequestBody(req.body);

    const {firstName, lastName, mobileNumber, experienceInBanking, adminBranch, gender, personalEmail, password, confirmPassword} = reqObj;

    // Create an admin email using fName, lName
    const emailTypes = [
      `${firstName.trim().toLowerCase().split(' ').join('')}.${lastName.trim().toLowerCase().split(' ').join('')}@BOS.com`,
      `${firstName.trim().toLowerCase().split(' ').join('')}_${lastName.trim().toLowerCase().split(' ').join('')}@BOS.com`,
      `${firstName.trim().toLowerCase().split(' ').join('')}.${lastName.substr(0, 1).toLowerCase()}@BOS.com`,
      `${lastName.trim().toLowerCase().split(' ').join('')}${firstName.trim().toLowerCase().split(' ').join('')}@BOS.com`,
      `${lastName.trim().toLowerCase().split(' ').join('')}.${firstName.trim().toLowerCase().split(' ').join('')}@BOS.com`
    ];

    // Deciding permissions for admin
    const permissions = [];
    if (experienceInBanking > 5) {
      permissions.push('Read', 'Write', 'Delete');
    } else if (experienceInBanking < 2) {
      permissions.push('Read');
    } else {
      permissions.push('Read', 'Write');
    }

    // Checking correct branch
    if (!['E-City, Bangalore', 'Neeladri, Bangalore', 'Kempegowda, Bangalore', 'Koramangala, Bangalore'].includes(adminBranch)) {
      return res.status(400).json({errors: [{msg: 'Branch is not valid'}]});
    }

    // Checking confirmPassword with password
    if (confirmPassword !== password) {
      return res.status(400).json({errors: [{msg: 'Passwords didnot match'}]});
    }

    try {
      // Check if admin already exists
      let admin = await Admin.findOne({mobileNumber: {$eq: mobileNumber}});
      if (admin) {
        return res.status(400).json({errors: [{msg: 'User already exist, Please try with new Number.'}]});
      }

      const adminEmail = await Admin.findOne({personalEmail: {$eq: personalEmail}});
      if (adminEmail) {
        return res.status(400).json({errors: [{msg: 'E-mail already registered, Please try with new one'}]});
      }

      // Checking E-mail already registered or not
      const emailForAdmin = [];
      for (let i = 0; i < emailTypes.length; i++) {
        admin = await Admin.findOne({email: emailTypes[i]});
        if (!admin) {
          emailForAdmin.push(emailTypes[i]);
        }
      }

      // Avatar
      const avatar = gravatar.url(emailForAdmin[0], {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // Creating instance of admin from mongoDB
      const createdAdmin = new Admin({
        firstName,
        lastName,
        email: emailForAdmin[0],
        gender,
        personalEmail,
        mobileNumber,
        permissions,
        avatar,
        adminId: Number(Math.floor(10000000 + Math.random() * 90000000)),
        password,
        adminBranch
      });

      // Password Encyption
      const salt = await bcrypt.genSalt(10);
      createdAdmin.password = await bcrypt.hash(password, salt);

      //Save to Data-base
      await createdAdmin.save();

      //JSONWebToken Implimentation
      const payload = {
        admin: {
          id: createdAdmin.id
        }
      };
      jsonWebToken.sign(
        payload,
        config.get('jwtSecretAdmin'),
        {expiresIn: 3600}, // basically prefered 3600 in prod mode
        async (err, token) => {
          if (err) throw err;
          //Send token to E-Mail
          res.json({token});
          await sendEmail(personalEmail, firstName, `token: ${token}`);
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
