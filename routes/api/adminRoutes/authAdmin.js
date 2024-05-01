const express = require('express');
const adminAuth = require('../../../middleware/adminAuth');
const Admin = require('../../../models/adminModels/Admin');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');
const sendEmail = require('../../utils/emailTemplate');

const router = express.Router();

// @route   GET api/authAdmin
// @desc    Validate with middleware
// @access  Private
router.get('/', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/authAdmin/verifyToken
// @desc    Validate with middleware
// @access  Public
router.get('/verifyToken', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');

    await sendEmail(admin.personalEmail, admin.firstName, `Login Email-ID: ${admin.email}`);

    res.json(admin);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/authAdmin
// @desc    Authenticate admin
// @access  Public
router.post(
  '/',
  [check('email', 'Please include a valid Email-Id').isEmail(), check('password', 'Password is required').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
      // Check if admin exists
      let admin = await Admin.findOne({email});
      if (!admin) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
      }

      //JSONWebToken Implimentation
      const payload = {
        admin: {
          id: admin.id
        }
      };
      jsonWebToken.sign(
        payload,
        config.get('jwtSecretAdmin'),
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
