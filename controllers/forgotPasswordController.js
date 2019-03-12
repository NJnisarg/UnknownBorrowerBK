const ses = require('../config/sesConfig');
const User = require('../models/user');
const FP = require('../models/forgotPassword');
const {response } = require('../helpers/response');
const bcrypt = require('bcryptjs');

module.exports = {

    'generateForgotPasswordEmail' : async (req,res) => {
        let emailId = req.body.emailId;

        try{
            let user = await User.findOne({
                where: {emailId}
            });

            let userId = user.userId;
            let OTP = Math.random().toString(36).substring(7);


            if(ses("NJnisarg@gmail.com",OTP))
            {
                FP.create({userId,OTP}).then(() => {
                    response(res,null,"OTP Sent",null,200);
                }).catch((err) => {
                    response(res,err,"OTP Sent but is invalid",null,500);
                })
            }
            else
            {
                response(res,null,"OTP Could not be sent",null,500);
            }
        }
        catch (e) {
            response(res,e,"User does not exist with this email",null,404);
        }

    },

    'verifyOTP' : async (req,res) => {
        let OTP = req.body.otp;

        if(OTP!=null || OTP !== "")
        {
            try{
                fp = await FP.findOne({
                    where: {OTP}
                });

                try{
                    let user = await User.findOne({
                        where:{userId:fp.userId}
                    });

                    res = { emailId:user.emailId, OTP:fp.OTP, userId:user.userId};

                    response(res,null,res,null,200);
                }
                catch (e) {
                    response(res,e,"Corresponding user not found",null,404);
                }
            }
            catch(e){
                response(res,e,"Such an OTP does not exist",null,404);
            }
        }
    },

    'resetPassword' : async (req,res) => {
        let userId = req.body.userId;
        let OTP = req.body.OTP;
        let newPassword = req.body.newPassword;

        let hashedPassword = bcrypt.hashSync(newPassword, 8);

        try{
            let fp = await FP.findOne({
                where: {userId}
            });

            User.update({ 'password' : hashedPassword}, { where : { userId: fp.userId}}).then(count => {
                console.log('Rows updated ' + count)
            })

            response(res, null, 'Password updated successfully', null, 202);

        }
        catch(e){
            response(res, e, "Corresponding User not found", null, 404);
        }
    }
};