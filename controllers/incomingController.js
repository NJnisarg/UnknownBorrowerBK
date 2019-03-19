const incoming =  require('../models/transaction');
const {response} = require('../helpers/response');
const profile = require('../models/profile');

module.exports= {
    // getting all requests made by borrower
    'getreqRec' : async (req,res,next)=>{
        let userId = req.userId;

        try {
            let requestReceivedList = await incoming.findAll({
                where : {
                    lenderID : userId,
                    status : 1
                }
            });

            console.log(requestReceivedList);

            if(requestReceivedList == null){
                response(res,null,'No such requests exist',null,404);
            }
            else
                response(res,null,requestReceivedList,null,200);


        }
        catch (err)
        {
            console.log(err);
            response(res,null,'Something went wrong',404);
        }
    },

    // getting all requests accepted by user
    'getreqAcc': async (req,res,next) =>{
        let userId = req.userId;

        try {
            let requestsAccepptedList = await incoming.findAll({
                where : {
                    lenderID : userId,
                    status : 2
                }
            });

            console.log(requestsAccepptedList);
            if(requestsAccepptedList == null){
                response(res,null,'No such requests exist',null,404);
            }
            else
                response(res,null,requestsAccepptedList,null,200);
        }
        catch (err)
        {
            console.log(err);
            response(res,null,'Something went wrong',null,404);
        }
    },

    // delete the transaction from the requests made but not confirmed
    'decline' : async (req,res,next)=>{
        let userID = req.userId;
        let transID = req.body.transactionId;
        try {
            incoming.destroy({
                where: {
                    transactionId:transID,
                }
            }).then((rowDeleted)=>{
                if( rowDeleted === 1 )
                {
                    response(res,null,'Succesfully deleted',null,200);
                }
            },(error)=>{
                console.log(error);
                response(res,null,'Not successful',null,404);
            });

        }catch (err) {
            console.log(err);
            response(res,null,'Something went wrong',null,404);
        }

    },

    // view profile api below

    'getProfile': async (req, res, next) => {

        let userId = req.query.userId;

        try {
            let userProfile = await profile.findOne({
                where: {
                    userId: userId
                }
            });

            console.log(userProfile);

            if (userProfile === null) {
                response(res, null, 'No such user exists', null, 404);
            }

            response(res, null, userProfile, null, 200);

        } catch (err) {
            console.log(err);
            response(res, null, 'No such user exists', null, 404);
        }
    },
    // pay api below
    // pay the amount from lender to borrower

   'pay': async (req, res, next) => {
        let txnId = req.body.transactionId;
        let userId = req.userId;

        try{
            let txn = await incoming.findOne({
                where:{
                    transactionId: txnId
                }
            });

            let borrowerId = txn.get('borrowerId');
            let lenderId = txn.get('lenderId');
            let amt = txn.get('amount');

            let borrower = await profile.findOne({
                where:{
                    userId:borrowerId
                }
            });

            let lender = await profile.findOne({
                where:{
                    userId:lenderId
                }
            });

            if(lender.get('balance') < amt)
            {
                response(res,null,"insufficient funds",null,200);
            }
            else
            {
                profile.update({ balance : lender.get('balance') - amt },{ where : { userId: lenderId }}).then(count => {
                    console.log('Rows updated' + count)
                }).catch(e => {
                    response(res,e,"lender balance not changed",null,500);
                });

                profile.update({ balance : borrower.get('balance') + amt },{ where : { userId: borrowerId }}).then(count => {
                    console.log('Rows updated' + count)
                }).catch(e => {
                    response(res,e,"Borrower balance not changed",null,500);
                });

                incoming.update({
                    status: 2,
                    acceptedDate: new Date()
                }, { where: { transactionId: txnId}}).then(count => {
                    console.log('Rows updated' + count);
                    response(res, null, "payment successful",null,200);
                }).catch(e => {
                    response(res,e,"Status not changed",null,500);
                })
            }

        }catch(e)
        {
            response(res,e,"No such transaction exists",null, 404)
        }

   }
};