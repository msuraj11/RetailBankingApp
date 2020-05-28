const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter the password with 6 or more characters').isLength({min: 6})
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {name, email, password} = req.body;

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({errors: [ {msg: 'User already exist, Please try logging in.'} ]})
            }

            // Avatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            // Creating instance of user from mongoDB
            user = new User({
                name,
                email,
                avatar,
                password
            })

            // Password Encyption
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            //Save to Data-base
            await user.save();

            res.send('User registered successfully');
        } catch(err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
