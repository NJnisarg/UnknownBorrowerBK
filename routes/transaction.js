const express = require('express');
const transactionRouter = express.Router();
const transactionController = require('../controllers/transactionController');

/* Send Request to lender */
transactionRouter.post('/sendRequest',transactionController.sendRequest);

//check
transactionRouter.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


module.exports = transactionRouter;