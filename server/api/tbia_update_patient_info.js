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
        path: '/update_patient_info',
        config: {
            // auth: {
            //     // strategies: ['simple', 'jwt', 'session']
            // },
            validate: {
                payload: {
                    userID: Joi.string().required(),
                    patient_info: Joi.string().required(),
                },
            }
        },
        handler: function(request, reply) {
            let MongoClient = require('mongodb').MongoClient;
            let assert = require('assert');
            var url = 'mongodb://localhost:27017/anchor';
            var complete = false;
            var user_ID = request.payload.userID;
            var user_patient_info = request.payload.patient_info;
            user_patient_info = JSON.parse(user_patient_info);

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

            function db_remove(callback) {
                if (open_sessions.length == 0) {
                    callback(null, null)
                } else {
                    return MongoClient.connect(url).then(function(db) {
                        var collection = db.collection('patient_info');
                        return collection.deleteOne({ "user_patient_info.userID": user_ID });
                    }).then(function(items) {
                        callback(null, null);
                    });
                }
            }

            function db_insert(callback) {
                if (open_sessions.length == 0) {
                    callback(null, null)
                } else {
                    return MongoClient.connect(url).then(function(db) {
                        var collection = db.collection('patient_info');
                        return collection.insert({ user_patient_info });
                    }).then(function(items) {
                        complete = true;
                        callback(null, null);
                    });
                }
            }

            function send_reply(callback) {
                reply({
                    completed: complete
                })
            }

            async.series([find_session, db_remove, db_insert, send_reply])

        }
    });

    next();
};

exports.register = function(server, options, next) {
    server.dependency(['auth', 'hicsail-hapi-mongo-models'], internals.applyRoutes);
    next();
};

exports.register.attributes = {
    name: 'update_patient_info'
};