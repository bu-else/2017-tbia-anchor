'use strict';
const Joi = require('joi');
const MongoModels = require('hicsail-mongo-models');


class Patient_Info extends MongoModels {

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


Patient_Info.collection = 'patient_info';

Patient_Info.schema = Joi.object({
    _id: Joi.object(),
    name: Joi.string().required(),
    userId: Joi.boolean().required(),
    time: Joi.date().required()
});

Patient_Info.payload = Joi.object({
    name: Joi.string().required()
});


Patient_Info.indexes = [
    { key: { name: 1 } },
    { key: { time: 1 } },
    { key: { userId: 1 } }
];


module.exports = Patient_Info;