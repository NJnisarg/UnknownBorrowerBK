//const transaction = require('../models/transaction');
const transactionController = require('../models/transaction');
const profile = require('../models/profile');
const { response } = require('../helpers/response');

module.exports = {
    'sendRequest' : async (req,res,next) => {
        const {
            borrowerName,
            lenderId,
            lenderName,
            amount
        } = req.body;

        let borrowerId = req.userId;

        transactionController.create({
            borrowerId: borrowerId,
            borrowerName: borrowerName,
            lenderId: lenderId,
            lenderName: lenderName,
            amount: amount,
            status: 1
        }).then(ans=>{
            response(res, null, ans, null, 201);
        }).catch(err => {
            console.log(err);
            response(res, null, 'Transaction did not initiate', null, 500);
        });
    },

    'getalltransactions' : async(req,res) => {

        let userId = req.userId;


        try{

            let user_transactions = await transactionController.findAll({
                where: {lenderId: userId}
             });

            let user_txns2 = await transactionController.findAll({
                where: {borrowerId: userId}
            });


            response(res,null,user_transactions.concat(user_txns2),null,200);
        }
        catch (err) {
            console.log(err);
            response(res, null, 'No such transaction exists', null, 401)
        }

    }
};