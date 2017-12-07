'use strict';
const Boom = require('boom');
const Joi = require('joi');
const async = require('async');

const internals = {};


internals.applyRoutes = function(server, next) {

    // const Event = server.plugins['hicsail-hapi-mongo-models'].Event;
    // const User = server.plugins['hicsail-hapi-mongo-models'].User;

    server.route({
        method: 'POST',
        path: '/responses',
        config: {
            // auth: {
            //     // strategies: ['simple', 'jwt', 'session']
            // },
            validate: {
                payload: {
                    userID: Joi.string().required(),
                    assessment_result: Joi.string().required(),
                },

            }
        },

        handler: function(request, reply) {
            let MongoClient = require('mongodb').MongoClient;
            let assert = require('assert');
            var url = 'mongodb://localhost:27017/anchor';
            var user_ID = request.payload.userID;
            var user_result = request.payload.assessment_result;
            user_result = JSON.parse(user_result);

            var received = false;
            var open_sessions = null;

            function callback(err, num) {
                assert.equal(null, err);
                return num;
            }

            function find_session(callback) {
                return MongoClient.connect(url).then(function(db) {
                    var collection = db.collection('sessions');

                    return collection.find({ userId: user_ID }).toArray();
                }).then(function(items) {
                    open_sessions = items;
                    callback(null, items);
                });
            }

            function db_insert(callback) {
                if (open_sessions.length == 0) {
                    callback(null, null)
                } else {
                    return MongoClient.connect(url).then(function(db) {
                        var collection = db.collection('responses');

                        return collection.insert({ user_result });
                    }).then(function(items) {
                        received = true;
                        callback(null, null);
                    });
                }
            }

            function send_reply(callback) {
                reply({
                    server_received: received
                })
                callback(null, null);
            }

            async.series([find_session, db_insert, send_reply])

        }
    });

    // will be used to view prior assessment results

    // server.route({
    //     method: 'GET',
    //     path: '/responses',
    //     config: {
    //         // auth: {
    //         //     // strategies: ['simple', 'jwt', 'session']
    //         // },
    //         // validate: {
    //         //     // query: Joi.any()
    //         // }
    //     },
    //     handler: function(request, reply) {
    //         let MongoClient = require('mongodb').MongoClient;
    //         let assert = require('assert');
    //         var url = 'mongodb://localhost:27017/tbia';
    //         var response = null;

    //         function callback(err, num) {
    //             assert.equal(null, err);
    //             return num;
    //         }

    //         function db_lookup(callback) {
    //             return MongoClient.connect(url).then(function(db) {
    //                 var collection = db.collection('assessments');

    //                 return collection.find({ title: 'Survey' }).toArray(); // edit here
    //             }).then(function(items) {
    //                 response = items;
    //                 callback(null, items);
    //             });
    //         }

    //         function send_reply(callback) {
    //             reply({
    //                 assessments: response
    //             })
    //         }

    //         async.series([db_lookup, send_reply])

    //     }
    // });





    next();
};



exports.register = function(server, options, next) {
    server.dependency(['auth', 'hicsail-hapi-mongo-models'], internals.applyRoutes);
    next();
};

exports.register.attributes = {
    name: 'responses'
};