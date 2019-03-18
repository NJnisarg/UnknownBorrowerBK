const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');

const Profile = sequelize.define('profile',{
    userId : { type: Sequelize.INTEGER, primaryKey: true },
    name : { type: Sequelize.STRING(45), allowNull: false },
    imageUrl : {type: Sequelize.STRING(200), allowNull: true},
    city : { type: Sequelize.STRING(45), allowNull: false },
    state : { type: Sequelize.STRING(45), allowNull: false },
    org : { type: Sequelize.STRING(45), allowNull: false },
    country : { type: Sequelize.STRING(45), allowNull: false },
    contactNum : { type: Sequelize.STRING, unique: true},
    emailId : { type: Sequelize.STRING(128), unique: true},
    ratings : { type: Sequelize.DOUBLE },
    age : { type: Sequelize.INTEGER, allowNull: false},
    gender : { type: Sequelize.INTEGER, allowNull: false},
    occupation : { type: Sequelize.STRING(128), allowNull: false},
    balance : { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
});

module.exports = Profile;