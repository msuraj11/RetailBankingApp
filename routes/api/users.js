const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');
const sendEmail = require('../utils/emailTemplate');
const {getCleanRequestBody} = require('../utils/helpers');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('mobileNumber', 'Please enter a valid 10 digit mobile number').isMobilePhone('en-IN'),
    check('password', 'Please enter the password with 6 or more characters').isLength({min: 6})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {name, email, mobileNumber, password} = getCleanRequestBody(req.body);

    try {
      // Check if user already exists
      let user = await User.findOne({mobileNumber: {$eq: mobileNumber}});
      if (user) {
        return res.status(400).json({errors: [{msg: 'User already exist, Please try with new Number.'}]});
      }

      // Checking E-mail already registered or not
      user = await User.findOne({email: {$eq: email}});
      if (user) {
        return res.status(400).json({errors: [{msg: 'E-mail already registered, Please try with new one'}]});
      }

      // Avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // Creating instance of user from mongoDB
      const newUser = new User({
        name,
        email,
        mobileNumber,
        avatar,
        customerId: Number(Math.floor(100000000 + Math.random() * 900000000)),
        password
      });

      // Password Encyption
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(Buffer.from(password, 'base64').toString('ascii'), salt);

      //Save to Data-base
      await newUser.save();

      //JSONWebToken Implimentation
      const payload = {
        user: {
          id: newUser.id
        }
      };

      jsonWebToken.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 300}, // basically prefered 3600 in prod mode
        async (err, token) => {
          if (err) throw err;
          //Send token to E-Mail
          res.json({token});
          await sendEmail(email, name, `token: ${token}`);
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
