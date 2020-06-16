const express = require('express');
const auth =  require('../../middleware/auth');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');
const nodemailer = require('nodemailer');

const router = express.Router();

// @route   GET api/auth
// @desc    Validate with middleware
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const fromMail = 'vaishnavimatchings.mamidi77@gmail.com';
        const toMail = user.email;
        const subject = 'Welcome to BOS';
        const text = `Hi ${user.name},

Welcome to Bank of Suraj(BOS). Please note down your Customer-ID: ${user.customerId}. Note that this is confidential.


Thanks,
BOS`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: fromMail ,
                pass: 'jaibhavani'
            }
        });

        const mailOptions = {
            from: fromMail,
            to: toMail,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log('error:',error);
                return res.status(404).json({msg: 'E-mail is not valid'});
            }
            console.log('response', response)
            });

        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user
// @access  Public
router.post('/', [
    check('customerId', 'Please include a valid customer-Id').isLength({min: 9, max:9}),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {customerId, password} = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ customerId });
        if (!user) {
            return res.status(400).json({errors: [ {msg: 'Invalid Credentials'} ]});
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({errors: [ {msg: 'Invalid Credentials'} ]});
        }

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
