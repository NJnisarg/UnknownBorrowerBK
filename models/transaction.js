const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');

const Transaction = sequelize.define('transaction', {
    transactionId : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    borrowerId : { type: Sequelize.INTEGER, allowNull: false },
    borrowerName : { type: Sequelize.STRING(45), allowNull: false },
    lenderId : { type: Sequelize.INTEGER, allowNull: false },
    lenderName : { type: Sequelize.STRING(45), allowNull: false },
    amount : { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    requestedDate : { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.NOW },
    acceptedDate : { type: Sequelize.DATEONLY, allowNull: false },
    completionDate : { type: Sequelize.DATEONLY, allowNull: false },
    status : { type: Sequelize.INTEGER, allowNull: false },
});

module.exports = Transaction;