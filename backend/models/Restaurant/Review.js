const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    restaurant_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    user_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    user_name:{
        type : String,
        required : true,
        min : 1,
        max : 255
    },
    content : {
        type : String,
        required : true,
        min : 1,
        max : 255
    },
    rating : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('Review',reviewSchema);