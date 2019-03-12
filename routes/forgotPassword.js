const express = require('express');
const fpRouter = express.Router();
const fpController = require('../controllers/forgotPasswordController');

/* Sending the mail */
fpRouter.post('/sendOTPMail', fpController.generateForgotPasswordEmail);

fpRouter.post('/verifyOtp', fpController.verifyOTP);

fpRouter.put('/resetPassword',fpController.resetPassword);

module.exports = fpRouter;
