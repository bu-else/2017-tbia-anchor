'use strict';
const Boom = require('boom');
const Joi = require('joi');


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

            reply({
                success: true,
            });
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