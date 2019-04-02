const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: "dHZy/lPnvbchTUruS/J4WiBVcxHJr3ON2gwD9lOz",
    accessKeyId: "AKIAIAMY3IABPCHQMT6Q",
    region: 'us-east-1'
});

const s3 = new aws.S3();

module.exports = s3;