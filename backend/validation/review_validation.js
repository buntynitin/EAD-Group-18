const Joi = require('joi');

const reviewValidation = (data) => {
    const schema = Joi.object({
        restaurant_id: Joi.string().min(24).max(24).required(),
        content: Joi.string().min(1).max(255).required(),
        rating: Joi.number().min(1).max(5).required(),
    });
    return schema.validate(data)
}

module.exports.reviewValidation = reviewValidation;