import express from 'express';
import {check, validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import jsonWebToken from 'jsonwebtoken';
import config from 'config';

import sendEmail from '../utils/emailTemplate.js';
import {getCleanRequestBody} from '../utils/helpers.js';
import authMiddleware from '../../middleware/auth.js';
import User from '../../models/User.js';

const router = express.Router();

// @route   GET api/auth
// @desc    Validate with middleware
// @access  Public
router.get('/', authMiddleware, async (req, res) => {
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
router.get('/verifyToken', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById({$eq: req.user.id}).select('-password');

    await sendEmail(user.email, user.name, `Customer-ID: ${user.customerId}`);

    res.json(user);
  } catch (err) {
    console.log(err?.code);
    res.status(500).send(`Failed due to code: ${err?.code}, reason: ${err?.response}`);
  }
});

// @route   POST api/auth
// @desc    Authenticate user
// @access  Public
router.post(
  '/',
  [
    check('customerId', 'Please include a valid customer-Id').isLength({min: 9, max: 9}),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    // NoSQL operations should not be vulnerable to injection attacks
    // jssecurity:S5147, CWE fix
    const reqObj = getCleanRequestBody(req.body);

    const {customerId, password} = reqObj;

    try {
      // Check if user exists
      let user = await User.findOne({customerId: {$eq: customerId}});
      if (!user) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(
        Buffer.from(password, 'base64').toString('ascii'),
        user.password
      ); // Buffer.from(data, 'base64')
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

export default router;
