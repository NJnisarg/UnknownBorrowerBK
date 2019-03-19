const transactionController = require('../models/transaction');
const { response } = require('../helpers/response');

module.exports = {
    'sendRequest' : async (req,res,next) => {
        const {
            //borrowerId,
            borrowerName,
            lenderId,
            lenderName,
            amount,
            status
        } = req.body;

        let borrowerId = req.userId;

        transactionController.create({
            borrowerId: borrowerId,
            borrowerName: borrowerName,
            lenderId: lenderId,
            lenderName: lenderName,
            amount: amount,
            status: status
        }).then(ans=>{
            response(res, null, ans, null, 201);
        }).catch(err => {
            console.log(err);
            response(res, null, 'Transcation did not initiate', null, 500);
        });
    }
};