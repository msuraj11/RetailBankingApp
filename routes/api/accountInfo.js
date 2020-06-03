const express = require('express');

const router = express.Router();

// @route   GET api/accountInfo
// @desc    This is to get the account Info
// @access  Private
router.get('/', (req, res) => res.send('Post route'));

module.exports = router;
