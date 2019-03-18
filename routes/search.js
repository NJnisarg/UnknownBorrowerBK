const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/get', searchController.get);
router.get('/viewProfile',searchController.viewProfile);

module.exports = router;