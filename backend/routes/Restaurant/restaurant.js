
const router = require('express').Router();

const RestaurantOwner = require('../../models/Restaurant/RestaurantOwner');
const Restaurant = require('../../models/Restaurant/Restaurant');
const FoodItem = require('../../models/Restaurant/FoodItem')
const Review = require('../../models/Restaurant/Review')
const bcrypt = require('bcryptjs');
const { cloudinary } = require('../../components/cloudinary');
const { restaurantOwnerValidation, restaurantValidation, restaurantLoginValidation, foodItemValidation, latlngValidation, } = require('../../validation/restaurant_validation');
const { reviewValidation } = require('../../validation/review_validation');
const { getRestaurantByFoodValidation } = require('../../validation/get_restaurant_by_food_validation')
const jwt = require('jsonwebtoken');
const geolib = require('geolib');
var mongoose = require('mongoose');
const verify = require('./verifyToken');
const { encryption } = require('../../components/encryption');
const { decryption } = require('../../components/decryption');





const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}




router.post('/registerOwner', async (req, res) => {
    //FORM ERRORS
    const { error } = restaurantOwnerValidation(req.body)
    if (error)
        return res.status(400).json({ 'error': error.details[0].message })

    //ALREADY REGISTERED USER
    try {
        const emailExists = await RestaurantOwner.findOne({ email: (req.body.email) })
        if (emailExists)
            return res.status(400).json({ 'error': "Email already registered" })
    } catch {
        return res.status(400).json({ 'error': "Network error" })
    }

    //HASHING PASS
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //ADD NEW USER
    const restaurantowner = new RestaurantOwner({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
    })
    try {
        const savedrestaurantowner = await restaurantowner.save();
        res.send({ 'owner_id': savedrestaurantowner._id })

    } catch (e) {
        res.status(400).json({ 'error': "Network error" });
    }
}

);


router.post('/addRestaurant', async (req, res) => {
    const { error } = restaurantValidation(req.body)
    if (error)
        return res.status(400).json({ 'error': error.details[0].message })


    try {
        const ownerExists = await RestaurantOwner.findOne({ _id: mongoose.Types.ObjectId(req.body.owner_id) })
        if (!ownerExists)
            return res.status(400).json({ 'error': "Owner_ID does not exist" })
    } catch {
        return res.status(400).json({ 'error': "Network error" })
    }

    try {
        const sameOwnerExists = await Restaurant.findOne({ owner_id: mongoose.Types.ObjectId(req.body.owner_id) })
        if (sameOwnerExists)
            return res.status(400).json({ 'error': "Owner must have a single restaurant" })
    } catch {
        return res.status(400).json({ 'error': "Network error" })
    }



    const restaurant = new Restaurant(req.body)
    try {
        const savedRestaurant = await restaurant.save();
        res.send({ 'restaurant_id': savedRestaurant._id })

    } catch (e) {
        res.status(400).json({ 'error': "Network error" });
    }
});


router.post('/login', async (req, res) => {
    //FORM ERRORS
    const { error } = restaurantLoginValidation(req.body)
    if (error)
        return res.status(400).json({ 'error': error.details[0].message })

    //IF USER REGISTERED
    try {
        const restaurantowner = await RestaurantOwner.findOne({ email: (req.body.email) })
        if (!restaurantowner)
            return res.status(400).json({ 'error': "Account not found" })

        const validPass = await bcrypt.compare(req.body.password, restaurantowner.password);
        if (!validPass)
            return res.status(400).json({ 'error': "Invalid Credentials!" })

        //CREATE AND ASSIGN TOKEN    
        const token = jwt.sign({ _id: restaurantowner._id, username: restaurantowner.username, email: restaurantowner.email }, process.env.TOKEN_SECRET)
        return res.status(200).json({ 'token': token })
        // res.header('auth-token', token).send(token)

    } catch {
        return res.status(400).json({ 'error': "Network error" })
    }

})


router.post('/addFood', verify, async (req, res) => {

    const { error } = foodItemValidation(req.body)
    if (error)
        return res.status(400).json({ 'error': error.details[0].message })

    try {
        const rest = await Restaurant.findOne({ owner_id: mongoose.Types.ObjectId(req.user._id) })
        if (!rest) {
            return res.status(400).json({ 'error': "Bad request" })
        }
        else {
            var formbody = req.body
            formbody["restaurant_id"] = rest._id
            const fooditem = new FoodItem(req.body)
            try {
                const savedfooditem = await fooditem.save();
                res.send(savedfooditem)

            } catch (e) {
                res.status(400).json({ 'error': "Network error" });
            }
        }


    } catch {
        return res.status(400).json({ 'error': "Network error" })
    }

}
);


router.post('/deleteFood', verify, async (req, res) => {

    try {
        const rest = await Restaurant.findOne({ owner_id: mongoose.Types.ObjectId(req.user._id) })
        if (rest) {
            try {
                const del = await FoodItem.deleteOne({ restaurant_id: mongoose.Types.ObjectId(rest._id), _id: mongoose.Types.ObjectId(req.body._id) })
                if (del) {

                    return res.status(200).json({ "message": "deleted" });

                }
                else {
                    return res.status(400).json({ 'error': "Bad request" });
                }
            }
            catch {
                return res.status(400).json({ 'error': "Network error" })
            }

        }
        else {

            return res.status(400).json({ 'error': "Bad request" });

        }


    } catch {
        return res.status(400).json({ 'error': "Network error" })
    }

}
);

router.get('/restaurantDetail', async (req, res) => {
    try {
        const detail = await Restaurant.findOne({ owner_id: mongoose.Types.ObjectId(req.query.owner_id) })
        res.send(detail)
    } catch (e) {
        res.status(400).json({ 'error': "Bad Request" });
    }
});



router.get('/restaurantList', async (req, res) => {
    const origin = { latitude: parseFloat(req.query.latitude), longitude: parseFloat(req.query.longitude) }
    const { error } = latlngValidation(origin)
    if (error)
        return res.status(400).json({ 'error': error.details[0].message })

    try {
        const list = await Restaurant.aggregate([
            {
                '$lookup': {
                    'from': 'reviews',
                    'localField': '_id',
                    'foreignField': 'restaurant_id',
                    'as': 'reviews'
                }
            }, {
                '$addFields': {
                    'average_rating': {
                        '$avg': '$reviews.rating'
                    }
                }
            }, {
                '$project': {
                    'tags': 1,
                    'image': 1,
                    'restaurantname': 1,
                    'openingtime': 1,
                    'closingtime': 1,
                    'average_rating': 1,
                    'coordinates': 1,
                    'address': 1,
                    'city': 1,
                    'state': 1,
                    'zipcode':1
                }
            }
        ]
        )

        const updatedList = []
        list.map((item) => {
            const distance = geolib.getDistance(origin, { latitude: item.coordinates[1], longitude: item.coordinates[0] })

            if (distance <= 5000)  //5km is restaurant's serviceable area
                updatedList.push(item)

        })
        res.send(updatedList)
    } catch (e) {
        res.status(400).json({ 'error': "Bad Request" });
    }


});





router.get('/allrestaurantList', async (req, res) => {
    try {
        const list = await Restaurant.find({})
        res.send(list)
    } catch (e) {
        res.status(400).json({ 'error': "Bad Request" });
    }


});


router.get('/restaurantCatalog', async (req, res) => {
    if (req.query.owner_id) {

        try {
            // const catalog = await FoodItem.find({ owner_id: mongoose.Types.ObjectId(req.query.owner_id) })
            const detail = await Restaurant.aggregate([
                {
                  '$match': {
                    'owner_id': mongoose.Types.ObjectId(req.query.owner_id)
                  }
                }, {
                  '$lookup': {
                    'from': 'fooditems', 
                    'localField': '_id', 
                    'foreignField': 'restaurant_id', 
                    'as': 'fooditems'
                  }
                }
              ])
         
            res.send(detail[0].fooditems)
        } catch (e) {
            res.status(400).json({ 'error': "Bad Request" });
        }
    }
    else {
        
            res.status(400).json({ 'error': "Bad Request" });
        
    }

});


router.get('/restaurantAlldetail', async (req, res) => {
   
    if (req.query.restaurant_id) {

        try {
            const catalog = await Restaurant.aggregate([
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(req.query.restaurant_id)
                    }
                },
                {
                    '$lookup': {
                        'from': 'fooditems',
                        'localField': '_id',
                        'foreignField': 'restaurant_id',
                        'as': 'catalog'
                    }
                },
                {
                    '$lookup': {
                        'from': 'reviews',
                        'localField': '_id',
                        'foreignField': 'restaurant_id',
                        'as': 'reviews'
                    }
                },
                {
                    '$addFields': {
                        'average_rating': {
                            '$avg': '$reviews.rating'
                        }
                    }
                }
            ]
            )




            res.send(catalog[0])
        } catch (e) {
            res.status(400).json({ 'error': "Bad Request" });
        }
    }
    else {

        res.status(400).json({ 'error': "restaurrant_id missing" });
    }

});






router.post('/uploadImage', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'restaurants',
        });
        res.status(200).json({ url: uploadResponse.url })
    } catch (err) {
        res.status(500).json({ err: 'Something went wrong' });
    }
});

router.post('/uploadFood', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'fooditems',
        });
        res.status(200).json({ url: uploadResponse.url })
    } catch (err) {
      
        res.status(500).json({ err: 'Something went wrong' });
    }
});


router.post('/addReview', verify, async (req, res) => {
    // await sleep(5000)
    // return res.status(400).send("erorr")
    const { error } = reviewValidation(req.body)
    if (error)
        return res.status(400).json({ 'error': error.details[0].message })

    const { _id, name } = req.user
    const { content, restaurant_id, rating } = req.body
    const review = new Review({
        restaurant_id: mongoose.Types.ObjectId(restaurant_id),
        user_id: mongoose.Types.ObjectId(_id),
        user_name: name,
        content,
        rating,
    })

    try {
        const savedreview = await review.save();
        res.send(savedreview)

    } catch (e) {
        res.status(400).json({ 'error': "Network error" });
    }

});


router.delete('/deleteReview', verify, async (req, res) => {
    // await sleep(5000)
    // return res.status(400).send("")
    const review_id = req.query.review_id
    try {
        await Review.findOne({ _id: mongoose.Types.ObjectId(review_id) }).
            exec((err, review) => {
                if (err || !review) {
                    res.status(404).json({ 'error': "Review not found" });
                } else {
                    if (review.user_id.toString() === req.user._id) {
                        review.remove()
                            .then(() => {
                                res.send(review)
                            })
                            .catch(() => {
                                res.status(400).json({ 'error': "Network error" });
                            })
                    } else {
                        res.status(401).json({ 'error': 'Invalid credentials' });
                    }
                }
            })
    } catch (e) {
        res.status(400).json({ 'error': "Network error" });
    }
})

router.post('/getRestaurantByFood', async (req, res) => {
    try {
        const mybody = JSON.parse(decryption(req.body.reqbody))
        const { error } = getRestaurantByFoodValidation(mybody)

        if (error)
            return res.status(400).json({ 'error': error.details[0].message })

        const foodName = mybody.food_name
        const latitude = mybody.latitude
        const longitude = mybody.longitude
        try {
            const foodList = await FoodItem.find({ 'name': { $regex: `.*${foodName}.*`, $options: 'i' } })
            let restaurantIdSet = new Set();
            for (item of foodList) {
                restaurantIdSet.add(item.restaurant_id.toString())
            }

            var newarr = []
            for (item of restaurantIdSet) {
                newarr.push(mongoose.Types.ObjectId(item))
            }

            try {
                const restaurantDetail = await Restaurant.aggregate([
                    {
                        '$match': {
                            '_id': { $in: newarr }
                        },
                    },
                    {
                        '$lookup': {
                            'from': 'reviews',
                            'localField': '_id',
                            'foreignField': 'restaurant_id',
                            'as': 'reviews'
                        }
                    }, {
                        '$addFields': {
                            'average_rating': {
                                '$avg': '$reviews.rating'
                            }
                        }
                    },
                    {
                        '$project': {
                            'tags': 1,
                            'image': 1,
                            'restaurantname': 1,
                            'openingtime': 1,
                            'closingtime': 1,
                            'average_rating': 1,
                            'coordinates': 1
                        }
                    }

                ])
                const updatedRestaurantDetail = []
                restaurantDetail.map((item) => {
                    const origin = { latitude: item.coordinates[1], longitude: item.coordinates[0] }
                    const distance = geolib.getDistance(origin, { latitude, longitude })
                    if (distance <= 5000)  //5km is delivery-agent's serviceable area
                        updatedRestaurantDetail.push(item)
                })
                res.json({resbody:encryption(JSON.stringify(updatedRestaurantDetail))})
            } catch (err) {
                res.status(400).json({ 'error': 'Bad request' })
            }

        } catch (err) {
            res.status(400).json({ 'error': 'Network error' })
        }
    } catch (err) {
        res.status(400).json({ 'error': 'Bad request' })
    }


})

// router.get('/test',(req,res) => {
//     const obj = {"_id":{"$oid":"5fd47350f94b620017a1bf29"},"tags":[{"key":0,"label":"North Indian"},{"key":100,"label":"South Indian"},{"key":99,"label":"Punjabi"}],"coordinates":[82.683922827,25.73781699468],"owner_id":{"$oid":"5fd4734ff94b620017a1bf28"},"restaurantname":"Red Chilli","mobile":7823943839,"image":"http://res.cloudinary.com/dez3yjolk/image/upload/v1607758565/restaurants/dpu4sl3irnhmr2cfnzpr.jpg","openingtime":"09:00","closingtime":"22:00","address":"Azamgarh Road, Wazidpur Tiraha, Jaunpur","city":"Jaunpur","state":"Uttar Pradesh","zipcode":222002,"__v":0}
//     const objString = JSON.stringify(obj)
//     const encryptedString = encryption(objString);
//     console.log(encryptedString);

//     // const encryptedString1 = cryptr.encrypt('bacon');

//     const decryptedString = decryption(encryptedString);
//     const wapas = JSON.parse(decryptedString)
//     console.log(wapas)
//     // const decryptedString1 = cryptr.decrypt(encryptedString1);

// })




module.exports = router