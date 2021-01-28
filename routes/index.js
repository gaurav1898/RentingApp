const express = require('express');
const router = express.Router();

//Defining routes after /api
router.use('/user', require('./user'));
router.use('/rent', require('./rent'));

module.exports = router;