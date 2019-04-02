const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: "1Ey5DUCGNOHqw2huf4sEgpiKal3tIJ3TW6LfWpsO",
    accessKeyId: "AKIAJYDP6B7ELFUJOAUA",
    region: 'us-east-1'
});

const s3 = new aws.S3();

module.exports = s3;