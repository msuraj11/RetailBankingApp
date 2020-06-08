const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('mobileNumber', 'Please enter a valid 10 digit mobile number').isMobilePhone('en-IN'),
        check('password', 'Please enter the password with 6 or more characters').isLength({min: 6}),
        check('confirmPassword', 'Please enter the confirm-password same as of password').isLength({min: 6}),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {name, email, mobileNumber, password, confirmPassword} = req.body;
        // Checking confirmPassword with password
        if (confirmPassword !== password) {
            return res.status(400).json({errors: [ {msg: 'Passwords didnot match'} ]});
        }

        try {
            // Check if user already exists
            let user = await User.findOne({ mobileNumber });
            if (user) {
                return res.status(400).json({errors: [ {msg: 'User already exist, Please try with new Number.'} ]});
            }

            // Checking E-mail already registered or not
            user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({errors: [ {msg: 'E-mail already registered, Please try with new one'} ]});
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
                mobileNumber,
                avatar,
                password
            });

            // Password Encyption
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            //Save to Data-base
            await user.save();

            //JSONWebToken Implimentation
            const payload = {
                user: {
                    id: user.id
                }
            }
            jsonWebToken.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 3600 }, // basically prefered 3600 in prod mode
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch(err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
