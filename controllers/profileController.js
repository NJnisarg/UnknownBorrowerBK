const profile = require('../models/profile');
const User = require('../models/user');
const { response } = require('../helpers/response');
const searchHandler = require('./searchController');
const bcrypt = require('bcryptjs');

module.exports = {
    'getProfile': async (req, res, next) =>  {

        let userId = req.userId;

        try {
            let userProfile = await profile.findOne({
                where:{
                    userId:userId
                }
            });

            console.log(userProfile);

            if(userProfile===null)
            {
                response(res, null, 'No such user exists', null, 404);
            }

            response(res,null,userProfile,null,200);

        }

        catch(err)
        {
            console.log(err);
            response(res, null, 'No such user exists', null, 404);
        }

    },

    'addMoney': async (req, res, next) => {
        let userId = req.userId;
        let userProfile = await profile.findOne({
            where:{
                userId:userId
            }
        });
        profile.update({ 'balance' : userProfile.get('balance') + req.body.amount },{ where : { userId: userId }}).then(count => {
            console.log('Rows updated' + count)
        });

        response(res, null, "Money added successfully!",null, 202);
    },

    'updatePassword': async (req, res, next) => {
        let currentPassword = req.body.currentPassword; //currentPassword from the request body
        let newPassword = req.body.newPassword; //newPassword from the request body

        let userId = req.userId; //decoded UserId

        //retrieves the UserProfile that matches with UserId
        let userProfile = await User.findOne({
            where:{
                userId:userId
            },
        });

        //confirms old password and updates with the new password
        if(bcrypt.compareSync(currentPassword, userProfile.get('password')))
        {
            let hashedPassword = bcrypt.hashSync(newPassword, 8);
            User.update({ 'password' : hashedPassword}, { where : { userId: userId}}).then(count => {
                console.log('Rows updated' + count)
            });

            response(res, null, 'Password updated successfully!', null, 202);

        }
        else
        {
            response(res, null, 'Password do not match', null, 401);
        }
    },

    'updateProfile': async (req, res, next) => {
        profile.update( req.body , { where : { userId: req.userId }}).then(count => {
            console.log('Rows updated' + count);

            let userObject = {
                userId: req.userId,
                city:req.body.city,
                organization: req.body.org,
                contactNum: req.body.contactNum,
                name: req.body.name
            };

            searchHandler.update(userObject);

            response(res, null, "Profile updated", null, 202);
        });
    },

    'createProfile': async (req, res, next) => {

        const {
            name,
            city,
            state,
            org,
            country,
            contactNum,
            emailId,
            ratings,
            age,
            gender,
            occupation,
            balance
        } = req.body;

        let userId = req.userId;

        profile.create({
            userId: userId,
            name: name,
            city: city,
            state: state,
            org: org,
            country: country,
            contactNum: contactNum,
            emailId: emailId,
            ratings: ratings,
            age: age,
            gender: gender,
            occupation: occupation,
            balance: balance
        }).then(user => {
            searchHandler.insert(user);
            response(res, null, user, null, 201);
        }).catch(err => {
                response(res, null, err, null, 500);
        });

    }
};