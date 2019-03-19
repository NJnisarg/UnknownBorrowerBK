const transactionModel =  require('../models/transaction');
const {response} = require('../helpers/response');
const profile = require('../models/profile');


module.exports= {
    // getting all requests made by borrower
    'getreqmade' : async (req,res,next)=>{
        let userId = req.userId;

        try {
            let requestsmadeList = await transactionModel.findAll({
               where : {
                   borrowerID : userId,
                   status : 1
               }
            });

            console.log(requestsmadeList);
            if(requestsmadeList == null){
                response(res,null,'No such requests exist',null,404);
            }
            else
                response(res,null,requestsmadeList,null,200);

            // response(res,null,"Successful connection",null,200)
        }
        catch (err)
        {
            console.log(err);
            response(res,null,'Something went wrong',404);
        }
    },

    // getting all requests confirmed by lender
    'getreqConfirmed': async (req,res,next) =>{
        let userId = req.userId;

        try {
            let requestsConfirmedList = await transactionModel.findAll({
                where : {
                    borrowerID : userId,
                    status : 2
                }
            });

            console.log(requestsConfirmedList);
            if(requestsConfirmedList == null){
                response(res,null,'No such requests exist',null,404);
            }
            else
                response(res,null,requestsConfirmedList,null,200);
        }
        catch (err)
        {
            console.log(err);
            response(res,null,'Something went wrong',null,404);
        }
    },

    // droprequest api below
    // delete the transaction from the requests made but not confirmed
    'dropRequest' : async (req,res,next)=>{
        let userID = req.userId;
        let transID = req.body.transactionId;
        try {
            transactionModel.destroy({
                where: {
                    transactionId:transID,
                    borrowerID: userID
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
    // pay api below
    // pay the amounnt from borrower to lender once the requests confirmed

    'pay_back' : async (req, res, next) => {
        let txnId = req.body.transactionId;
        let userId = req.userId;

        try{
            let txn = await transactionModel.findOne({
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

            if(borrower.get('balance') < amt)
            {
                response(res,null,"insufficient funds",null,200);
            }
            else
            {
                profile.update({ balance : borrower.get('balance') - amt },{ where : { userId: lenderId }}).then(count => {
                    console.log('Rows updated' + count)
                }).catch(e => {
                    response(res,e,"borrower balance not changed",null,500);
                });

                profile.update({ balance : lender.get('balance') + amt },{ where : { userId: borrowerId }}).then(count => {
                    console.log('Rows updated' + count)
                }).catch(e => {
                    response(res,e,"lender balance not changed",null,500);
                });

                transactionModel.update({
                    status: 0,
                    completionDate: new Date()
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