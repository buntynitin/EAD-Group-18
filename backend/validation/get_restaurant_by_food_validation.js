const Joi = require('joi')

const getRestaurantByFoodValidation = data =>{
    const schema = Joi.object({
        food_name : Joi.string().min(1).max(256).required(),
        latitude:Joi.number().max(90).min(-90).required(),
        longitude:Joi.number().max(180).min(-180).required(),
        })

    return schema.validate(data)
}

module.exports.getRestaurantByFoodValidation = getRestaurantByFoodValidation;