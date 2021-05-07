const Joi = require('joi');
const endpointValidation = (data) => {
    const schema = Joi.object({
        endpoint: Joi.string().required(),
        expirationTime: Joi.string().allow(null),
        keys:  Joi.object({
            p256dh : Joi.string().required(),
            auth : Joi.string().required(),
        }).required(),
        
    });
    return schema.validate(data)

}

module.exports.endpointValidation = endpointValidation;