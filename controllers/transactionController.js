//const transaction = require('../models/transaction');
const transactionController = require('../models/transaction');
const profile = require('../models/profile');
const { response } = require('../helpers/response');


 var uniqid = require('uniqid');
 let id=uniqid();
console.log(id);

module.exports = {
    'sendRequest' : async (req,res,next) => {
        const {
            //borrowerId,
            borrowerName,
            lenderId,
            lenderName,
            amount,
            requestedDate,
            acceptedDate,
            completionDate,
            status
        } = req.body;

        let borrowerId = req.userId;

        transactionController.create({
            transactionId: id,
            borrowerId: borrowerId,
            borrowerName: borrowerName,
            lenderId: lenderId,
            lenderName: lenderName,
            amount: amount,
            requestedDate: requestedDate,
            acceptedDate: acceptedDate,
            completionDate: completionDate,
            status: status
        }).then(ans=>{
            response(res, null, ans, null, 201);
        }).catch(err => {
            console.log(err);
            response(res, null, 'Transaction did not initiate', null, 500);
        });
    },

    'getalltransactions' : async(req,res) => {

        let userId = req.query.userId;


        try{

            let user_transactions = await transactionController.findAll({
                // $or:[{where:
                //         {borrowerId:userId},
                //         {lenderId:userId}}]


            $or: [{ where : {borrowerId: userId}}, {where: {lenderId: userId}}]

         // where: { $or: [{borrowerId: userId},{lenderId: userId}]}
         //         where: {
         //             $or: [{borrowerId: userId}, {lenderId: userId}]
         //         },
         //       where: {
         //             borrowerId : userId
         //          },
             });
            console.log(user_transactions);
            response(res,null,user_transactions,null,200);
        }
        catch (err) {
            console.log(err);
            response(res, null, 'No such transaction exists', null, 401)
        }

    }
};