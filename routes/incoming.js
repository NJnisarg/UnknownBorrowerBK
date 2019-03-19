const express = require('express');
const incomingRouter = express.Router();
const incomingController = require('../controllers/incomingController');
const authmiddleware= require('../controllers/loginController').AuthorizationMiddleware;

// get outgoing requests received
incomingRouter.get('/getreqRec',authmiddleware,incomingController.getreqRec);

// get outgoing requests accepted
incomingRouter.get('/getreqAcc',authmiddleware,incomingController.getreqAcc);

//GET borrower profile
incomingRouter.get('/getProfile',incomingController.getProfile);

// decline the request received
incomingRouter.post('/decline',authmiddleware,incomingController.decline);

//pay api
//incomingRouter.post('/pay',incomingController.pay);


module.exports= incomingRouter;