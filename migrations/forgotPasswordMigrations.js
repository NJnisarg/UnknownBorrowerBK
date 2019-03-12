const ForgotPassword = require('../models/forgotPassword');

ForgotPassword.sync({force: true}).then(() => {
    console.log("Forgot Password Migrations done")
}).catch((err) => {
    console.log(err);
});