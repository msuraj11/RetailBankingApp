const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');
const sendEmail = require('../utils/emailTemplate');

const router = express.Router();

// @route   GET api/auth
// @desc    Validate with middleware
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById({$eq: req.user.id}).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/verifyToken
// @desc    Validate with middleware
// @access  Public
router.get('/verifyToken', auth, async (req, res) => {
  try {
    const user = await User.findById({$eq: req.user.id}).select('-password');

    await sendEmail(user.email, user.name, `Customer-ID: ${user.customerId}`);

    res.json(user);
  } catch (err) {
    console.log(err?.code);
    res.status(500).send(`Failed due to code: ${err?.code}, reason: ${err?.response}` || 'Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user
// @access  Public
router.post(
  '/',
  [check('customerId', 'Please include a valid customer-Id').isLength({min: 9, max: 9}), check('password', 'Password is required').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {customerId, password} = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({customerId: {$eq: customerId}});
      if (!user) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(Buffer.from(password, 'base64').toString('ascii'), user.password); // Buffer.from(data, 'base64')
      if (!isMatch) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
      }

      //JSONWebToken Implimentation
      const payload = {
        user: {
          id: user.id
        }
      };
      jsonWebToken.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 3600}, // basically prefered 3600 in prod mode
        (err, token) => {
          if (err) throw err;
          res.json({token});
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
