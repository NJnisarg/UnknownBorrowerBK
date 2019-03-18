const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');

const Transaction = sequelize.define('transaction', {
    transactionId : { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
    borrowerId : { type: Sequelize.INTEGER, allowNull: false },
    borrowerName : { type: Sequelize.STRING(45), allowNull: false },
    ratings : { type: Sequelize.DOUBLE },
    lenderId : { type: Sequelize.INTEGER, allowNull: false },
    lenderName : { type: Sequelize.STRING(45), allowNull: false },
    amount : { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    requestedDate : { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.NOW },
    acceptedDate : { type: Sequelize.DATEONLY, allowNull: true },
    completionDate : { type: Sequelize.DATEONLY, allowNull: true },
    status : { type: Sequelize.INTEGER, allowNull: false },
});

module.exports = Transaction;