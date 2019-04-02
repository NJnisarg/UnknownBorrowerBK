const express = require('express');
const profileRouter = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../controllers/loginController').AuthorizationMiddleware;

/* GET user profile */
profileRouter.get('/getProfile', authMiddleware, profileController.getProfile);

/* PUT request for adding wallet money*/
profileRouter.put('/addMoney', authMiddleware, profileController.addMoney);

/* PUT request for uploading user profile image */
profileRouter.post('/uploadImage', authMiddleware, profileController.uploadImage);

/* PUT request to update the Profile */
profileRouter.put('/editProfile/', authMiddleware, profileController.updateProfile);

/* PUT request to change the Password */
profileRouter.put('/changePassword/', authMiddleware, profileController.updatePassword);
// authMiddleware retrieves UserId from the token and passes that UserId to the profileController=>updatePassword

/* POST request to create the Profile */
profileRouter.post('/createProfile', authMiddleware, profileController.createProfile);

module.exports = profileRouter;
