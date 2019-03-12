const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');

const ForgotPassword = sequelize.define('forgotPassword', {
    userId : { type: Sequelize.INTEGER, primaryKey: true},
    OTP : { type: Sequelize.STRING(45), allowNull: false},
});

module.exports = ForgotPassword;
