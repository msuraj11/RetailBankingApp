const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');
const Admin = require('../../../models/adminModels/Admin');

// @route   POST api/admin
// @desc    Register Admin
// @access  Public
router.post('/', [
        check('firstName', 'Please provide First-name').notEmpty(),
        check('lastName', 'Please provide Last-name').notEmpty(),
        check('mobileNumber', 'Please enter a valid 10 digit mobile number').isMobilePhone('en-IN'),
        check('experienceInBanking', 'Experience is mandatory').notEmpty().isNumeric(),
        check('gender', 'Please choose any option').notEmpty(),
        check('adminBranch', 'Please provide your branch').notEmpty(),
        check('password', 'Please enter the password with 6 or more characters').isLength({min: 6}),
        check('confirmPassword', 'Please enter the confirm-password same as of password').isLength({min: 6}),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {firstName, lastName, mobileNumber, experienceInBanking, adminBranch, gender,
            password, confirmPassword} = req.body;

        // Create an admin email using fName, lName
        const emailTypes = [
            `${firstName.trim().toLowerCase()}.${lastName.toLowerCase()}@BOS.com`,
            `${firstName.trim().toLowerCase()}_${lastName.toLowerCase()}@BOS.com`,
            `${firstName.trim().toLowerCase()}.${lastName.substr(0,1).toLowerCase()}@BOS.com`,
            `${lastName.toLowerCase()}${firstName.trim().toLowerCase()}@BOS.com`,
            `${lastName.toLowerCase()}.${firstName.trim().toLowerCase()}@BOS.com`
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
        if (!['E-City P-2', 'Neeladri'].includes(adminBranch)) {
            return res.status(400).json({errors: [ {msg: 'Branch is not valid'} ]});
        }

        // Checking confirmPassword with password
        if (confirmPassword !== password) {
            return res.status(400).json({errors: [ {msg: 'Passwords didnot match'} ]});
        }

        try {
            // Check if admin already exists
            let admin = await Admin.findOne({ mobileNumber });
            if (admin) {
                return res.status(400).json({errors: [ {msg: 'User already exist, Please try with new Number.'} ]});
            }

            // Checking E-mail already registered or not
            const emailForAdmin = [];
            for (let i=0; i< emailTypes.length; i++) {
                admin = await Admin.findOne({ email: emailTypes[i] });
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
                mobileNumber,
                permissions,
                avatar,
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
            }
            jsonWebToken.sign(
                payload,
                config.get('jwtSecretAdmin'),
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
