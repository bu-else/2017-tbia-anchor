'use strict';
const Joi = require('joi');
const MongoModels = require('hicsail-mongo-models');


class Response extends MongoModels {

    static create(name, userId, callback) {

        const document = {
            name: name.toUpperCase(),
            userId,
            time: new Date()
        };

        this.insertOne(document, (err, docs) => {

            if (err) {
                return callback(err);
            }

            callback(null, docs[0]);
        });
    }
}


Response.collection = 'responses';

Response.schema = Joi.object({
    _id: Joi.object(),
    name: Joi.string().required(),
    userId: Joi.boolean().required(),
    time: Joi.date().required()
});

Response.payload = Joi.object({
    name: Joi.string().required()
});


Response.indexes = [
    { key: { name: 1 } },
    { key: { time: 1 } },
    { key: { userId: 1 } }
];


module.exports = Response;