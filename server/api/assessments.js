'use strict';
const Boom = require('boom');
const Joi = require('joi');
const async = require('async');

const internals = {};


internals.applyRoutes = function (server, next) {

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
    handler: function (request, reply) {
      let MongoClient = require('mongodb').MongoClient;
      let assert = require('assert');
      var url = 'mongodb://localhost:27017/tbia-test';
      var response= null;

      function callback(err, num){
        assert.equal(null, err);
        return num;
      }

      async.series([
        
        function(callback){
          MongoClient.connect(url, function(err, db) {
          assert.equal(null, err);
          
          db.close();
          callback(null, 0)
          })
        },
      
        function(){
          reply({
            db_connection: db_active
          })
          callback(null, 0)
        },
      
      ])      

    }
  });

  next();
};

exports.register = function (server, options, next) {
  server.dependency(['auth', 'hicsail-hapi-mongo-models'], internals.applyRoutes);
  next();
};

exports.register.attributes = {
  name: 'assessments'
};
