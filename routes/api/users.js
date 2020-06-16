const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');
const nodemailer = require('nodemailer');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('mobileNumber', 'Please enter a valid 10 digit mobile number').isMobilePhone('en-IN'),
        check('password', 'Please enter the password with 6 or more characters').isLength({min: 6})
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {name, email, mobileNumber, password} = req.body;
        const fromMail = 'vaishnavimatchings.mamidi77@gmail.com';
        const toMail = email;
        const subject = 'Welcome to BOS';

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

                    //Send Profile to E-Mail
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: fromMail ,
                            pass: 'jaibhavani'
                        }
                    });
            
                    const text = `Hi ${name},

Welcome to Bank of Suraj(BOS). Please note down your token: ${token}. Note that this is confidential.


Thanks,
BOS`;
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
