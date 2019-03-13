const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');

const ForgotPassword = sequelize.define('forgotPassword', {
    forgotPasswordId : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    userId : { type: Sequelize.INTEGER, allowNull: false},
    OTP : { type: Sequelize.STRING(45), allowNull: false}
});

module.exports = ForgotPassword;
