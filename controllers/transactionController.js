const transactionController = require('../models/transaction');
const { response } = require('../helpers/response');
var uniqid = require('uniqid');
let id=uniqid();
//console.log(id);

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
            response(res, null, 'Transcation did not initiate', null, 500);
        });
    }
};