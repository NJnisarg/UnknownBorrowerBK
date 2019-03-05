const Transaction = require('../models/transaction');

Transaction.sync({force: true}).then(() => {
    console.log("Migrations done")
}).catch((err) => {
    console.log(err);
});