var express = require('express');
var router = express.Router();
const loginController = require('./loginController');

 // GET users listing.
router.post('/login', loginController.authenticateUser);

module.exports = router;


