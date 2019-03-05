const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');

const Transaction = sequelize.define('transaction', {
    transactionId : { type: Sequelize.INTEGER, primaryKey: true },
    borrowerId : { type: Sequelize.INTEGER, allowNull: false },
    lenderId : { type: Sequelize.INTEGER, allowNull: false },
    amount : { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    requestedDate : { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    acceptedDate : { type: Sequelize.DATE, allowNull: false },
    completionDate : { type: Sequelize.DATE, allowNull: false },
    status : { type: Sequelize.INTEGER, allowNull: false },
});

module.exports = Transaction;