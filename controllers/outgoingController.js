const transactionModel =  require('../models/transaction');
const {response} = require('../helpers/response');


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

    }
    // pay api below
    // pay the amounnt from borrower to lender once the requests confirmed

    // view profile api below
    // used the api already done before
};