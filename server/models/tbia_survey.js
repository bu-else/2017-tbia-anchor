'use strict';
const Joi = require('joi');
const MongoModels = require('hicsail-mongo-models');


class Survey extends MongoModels {

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


Survey.collection = 'surveys';

Survey.schema = Joi.object({
    _id: Joi.object(),
    name: Joi.string().required(),
    userId: Joi.boolean().required(),
    time: Joi.date().required()
});

Survey.payload = Joi.object({
    name: Joi.string().required()
});


Survey.indexes = [
    { key: { name: 1 } },
    { key: { time: 1 } },
    { key: { userId: 1 } }
];


module.exports = Survey;