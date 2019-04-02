let AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const sesSendMail = async (to,otp) => {

    let params = {
        Destination: {
            ToAddresses: [
                to
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: "OTP is : " + otp
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "OTP is : " + otp
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'OTP for Password Reset'
            }
        },
        Source: 'yashmagarwal786@gmail.com', /* required */
        ReplyToAddresses: [
            'yashmagarwal786@gmail.com'
        ]
    };

    let sesClient = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

    sesClient.then(
        function (data) {
            console.log(data);
            return true;
        }).catch(
        function (err) {
            console.log(err, err.stack);
            return false;
        });
};

module.exports = sesSendMail;