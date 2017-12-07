'use strict';
const Boom = require('boom');
const Joi = require('joi');
const async = require('async');

const internals = {};


internals.applyRoutes = function(server, next) {

    // const Event = server.plugins['hicsail-hapi-mongo-models'].Event;
    // const User = server.plugins['hicsail-hapi-mongo-models'].User;

    server.route({
        method: 'GET',
        path: '/assessments',
        config: {
            // auth: {
            //     // strategies: ['simple', 'jwt', 'session']
            // },
            // validate: {
            //     // query: Joi.any()
            // }
        },
        handler: function(request, reply) {
            let MongoClient = require('mongodb').MongoClient;
            let assert = require('assert');
            var url = 'mongodb://localhost:27017/anchor';
            var response = null;

            function callback(err, num) {
                assert.equal(null, err);
                return num;
            }

            function db_lookup(callback) {
                return MongoClient.connect(url).then(function(db) {
                    var collection = db.collection('assessments');

                    return collection.find({ title: { $ne: 'Survey' } }).toArray();
                }).then(function(items) {
                    response = items;
                    callback(null, items);
                });
            }

            function send_reply(callback) {
                reply({
                    assessments: response
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
    name: 'assessments'
};