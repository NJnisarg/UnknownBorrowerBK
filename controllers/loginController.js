const { response }= require('../helpers/response'); //Used for de-structuring. It allows to access the key:value pair from the object response. As key=>response value=>function
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/authConfig');

const authenticateUser = async (req,res) => {
    let contactNum = req.body.contactNum;
    let password = req.body.password;

    try{
        let user = await User.findOne({
            where: {
                contactNum: contactNum
            },
            attributes: ['userId','emailId','contactNum','password']
        });

        if(bcrypt.compareSync(password,user.get('password')))
        {
            let finalRes = {
                'userId':user.get('userId'),
                'emailId':user.get('emailId'),
                'contactNum':user.get('contactNum'),
                'token': jwt.sign({id: user.userId}, authConfig.jwtSecret, {expiresIn:86400})
            };
            response(res,null,finalRes,null,200);
        }
        else
        {
            response(res,null,'Passwords do not match',null,401);
        }

    }
    catch(err)
    {
        response(res,null,'No such user exists',null,404);
    }
};

const registerUser = async (req,res) => {

    let hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        emailId:req.body.emailId,
        contactNum: req.body.contactNum,
        password: hashedPassword

    }).then(user => {
        let token = jwt.sign({id: user.userId}, authConfig.jwtSecret, {expiresIn:86400});
        response(res,null,{'userId':user.userId,'emailId':user.emailId , 'contactNum':user.contactNum,'token':token},null,201);
    }).catch(err => {
        response(res,null,err,null,500);
    });
};

const AuthorizationMiddleware = async (req,res,next) => {
    let token = req.header('Authorization');

    if(!token)
    {
        response(res,null,{'error':'Token not provided'},null,401);
    }

    token = token.split(' ')[1];
    console.log(token);

    jwt.verify(token, authConfig.jwtSecret, async (err, decoded) => {
        if(err){
            response(res,null,{'error':'Token not verified'},null,401);
        }

        User.findOne({
            where:{
                userId:decoded.id
            }
        }).then(() => {
            req.userId = decoded.id;
            next();
        }).catch(() => {
            response(res,null,{'error':'No such user exists'},null,404)
        })
    });
};


module.exports={
    authenticateUser,
    registerUser,
    AuthorizationMiddleware
};