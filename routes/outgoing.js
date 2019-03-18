const express = require('express');
const outgoingRouter = express.Router();
const outgoingController = require('../controllers/outgoingController');
const authmiddleware= require('../controllers/loginController').AuthorizationMiddleware;

// get outgoing requests made
outgoingRouter.get('/outReqMade',authmiddleware,outgoingController.getreqmade);

// get outgoing requests confirmed
outgoingRouter.get('/outReqConfirmed',authmiddleware,outgoingController.getreqConfirmed);

// drop the outgoing request
// outgoingRouter.delete('/drop',)
outgoingRouter.post('/dropRequest',authmiddleware,outgoingController.dropRequest);

module.exports= outgoingRouter;