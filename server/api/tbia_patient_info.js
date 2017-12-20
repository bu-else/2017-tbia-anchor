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
        path: '/patient_info',
        config: {
            // auth: {
            //     // strategies: ['simple', 'jwt', 'session']
            // },
            validate: {
                payload: {
                    userID: Joi.string().required(),                
                },               
            }
        },
        handler: function(request, reply) {
            let MongoClient = require('mongodb').MongoClient;
            let assert = require('assert');
            var url = 'mongodb://localhost:27017/anchor';
            var response = null;
            var user_ID = request.payload.userID;

            function callback(err, num) {
                assert.equal(null, err);
                return num;
            }

            function db_lookup(callback) {
                return MongoClient.connect(url).then(function(db) {
                    var collection = db.collection('patient_info');
                    return collection.find({ "user_patient_info.userID": user_ID  }).toArray();
                }).then(function(items) {
                    response = items;
                    callback(null, items);
                });
            }

            function send_reply(callback) {
                reply({
                    patient_info: response[0].user_patient_info.patient_info
                })
            }

            async.series([db_lookup, send_reply])

        }
    });

    next();
};

exports.register = function(server, options, next) {
    server.dependency(['auth', 'hicsail-hapi-mongo-models'], internals.applyRoutes);
    next();
};

exports.register.attributes = {
    name: 'patient_info'
};