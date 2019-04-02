let esClient = require('../config/elasticsearchConfig');
let { response } = require('../helpers/response');
let profile = require('../models/profile');
let fetch = require('fetch').fetchUrl;
let jwt = require('jsonwebtoken');
let authConfig = require('../config/authConfig');


module.exports = {
    'get': async (req,res) => {
        let searchString = req.query.searchString;

        let esRes = await esClient.search({
            'index':'user_index',
            'type':'user',
            'body':{
                'query':{
                    'bool':{
                        'should':[
                            { 'term' : {'name':searchString }},
                            { 'term' : {'city': searchString} },
                            { 'term' : {'organization': searchString }}
                        ]
                    }
                }
            }
        });

        console.log(esRes);

        esRes = esRes['hits']['hits'];
        let finalResponse = [];

        esRes.forEach((obj) => {
            finalResponse.push(obj['_source'])
        });

        response(res,null,finalResponse,"Successful Search",200)
    },

    'viewProfile': async (req, res, next) => {

        //let userId = parseInt(req.query.id,10);
        let userId = req.query.id;
        try {
            let userProfile = await profile.findOne({
                where: {
                    userId: userId
                }
            });
            console.log(userProfile);

            if (userProfile === null) {
                response(res, null, 'No such user exists', null, 404);
            }

            response(res, null, userProfile, null, 200);

        } catch (err) {
            console.log(err);
            //response(res, null, 'No such user exists1', null, 404);
        }
    },

    'insert': async (userObject) => {

        fetch('https://us1.locationiq.com/v1/search.php?key=3ed6867bb4fcb6&q=Vadodara%20India&format=json',async (err,meta,body) => {

            let lat = JSON.parse(body.toString())[0]['lat'];
            let lon = JSON.parse(body.toString())[0]['lon'];

            console.log('lat: ' + lat + ' and lon: ' + lon);


            let esRes = await esClient.create({
                index: 'user_index',
                type: 'user',
                id : userObject.userId,
                body: {
                    userId : userObject.userId,
                    city: userObject.city,
                    contactNum: userObject.contactNum,
                    name: userObject.name,
                    organization: userObject.org,
                    location: {
                        "lat":lat,
                        "lon":lon
                    }
                }
            });

            try{
                console.log(esRes);
            }
            catch(err){
                console.log(err);
            }
        });
    },

    'update': async (userObject) => {
        let esRes = await esClient.update({
            index: 'user_index',
            type: 'user',
            id : userObject.userId,
            body: {
                doc: userObject
            }
        });

        try{
            console.log(esRes);
        }
        catch(err){
            console.log(err);
        }
    },

    'geoSearch': async (req,res) => {

        let token = req.query.token;

        jwt.verify(token, authConfig.jwtSecret, async (err, decoded) => {
            if (err) {
                response(res, null, {'error': 'Token not verified'}, null, 401);
            }

            let userId = decoded.id;

            let userResponse = await esClient.search({
                'index': 'user_index',
                'type': 'user',
                'body': {
                    'query': {
                        'term': {
                            'userId': userId
                        }
                    }
                }
            });

            let dt = userResponse['hits']['hits'][0]['_source'];
            console.log(dt);

            let esRes = await esClient.search({
                'index':'user_index',
                'type':'user',
                'body':{
                    'query':{
                        'bool':{
                            'must': {
                                'match_all' : {}
                            },
                            'filter': {
                                'geo_distance' : {
                                    'distance' : '350km',
                                    'location' : {
                                        'lat' : dt['location']['lat'],
                                        'lon' : dt['location']['lon']
                                    }
                                }
                            }
                        }
                    }
                }
            });

            esRes = esRes['hits']['hits'];
            let finalResponse = [];

            esRes.forEach((obj) => {
                finalResponse.push(obj['_source'])
            });

            response(res,null,finalResponse,"Successful Search",200)
        });
    }
};
