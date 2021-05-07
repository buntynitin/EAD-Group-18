const Endpoint = require('../models/Endpoint/Endpoint')
const webpush = require('web-push')
var mongoose = require('mongoose');

const publicVapidkey = "BCeTHaAuVH4EdRA8dbrbdv9xR0NqwA6EBReXEeCdMzSOgZLL7L8mGnzgDJBxj_tqA2n7Q3-Rth1iTbWqQJNGYbg"
const privateVapidkey = "AnKUJz0M7b7J0x7djb3npO8s9H2Q-DzmYMo7k2m1Kg0"

webpush.setVapidDetails("mailto:lpczeffy@gmail.com", publicVapidkey, privateVapidkey)

const confirmnotification = async (user_id) => {

  try {
    const endpoint = await Endpoint.findOne({ user_id: mongoose.Types.ObjectId(user_id) })
    if (endpoint) {
      const payload = JSON.stringify({
        title: 'FooDE',
        body: 'Your Order has been confirmed 🥡',
        image: 'https://res.cloudinary.com/dez3yjolk/image/upload/v1618328827/New_Project_2_mjbvqj.png',
        icon: 'https://res.cloudinary.com/dez3yjolk/image/upload/v1603378441/samples/kisspng-catering-food-computer-icons-logo-event-management-catering-5abf487cd18447_qcrvwi.png',
        badge: 'https://res.cloudinary.com/dez3yjolk/image/upload/v1603378441/samples/kisspng-catering-food-computer-icons-logo-event-management-catering-5abf487cd18447_qcrvwi.png'
      })
      webpush.sendNotification(endpoint, payload).catch(err => console.error(err));
    }
  } catch (e) {

  }

}

const intransitnotification = async (user_id) => {

  try {
    const endpoint = await Endpoint.findOne({ user_id: mongoose.Types.ObjectId(user_id) })
    if (endpoint) {
      const payload = JSON.stringify({
        title: 'FooDE',
        body: 'Out For Delivery 🛵',
        image: 'https://res.cloudinary.com/dez3yjolk/image/upload/v1618331665/New_Project_3_qptfbb.png',
        icon: 'https://res.cloudinary.com/dez3yjolk/image/upload/v1603378441/samples/kisspng-catering-food-computer-icons-logo-event-management-catering-5abf487cd18447_qcrvwi.png',
        badge: 'https://res.cloudinary.com/dez3yjolk/image/upload/v1603378441/samples/kisspng-catering-food-computer-icons-logo-event-management-catering-5abf487cd18447_qcrvwi.png'
      })
      webpush.sendNotification(endpoint, payload).catch(err => console.error(err));
    }
  } catch (e) {

  }

}


const deliverednotification = async (user_id) => {

  try {
    const endpoint = await Endpoint.findOne({ user_id: mongoose.Types.ObjectId(user_id) })
    if (endpoint) {
      const payload = JSON.stringify({
        title: 'FooDE',
        body: 'Food Delivered 🏡',
        image: 'https://res.cloudinary.com/dez3yjolk/image/upload/v1618333107/New_Project_4_scwirn.png',
        icon: 'https://res.cloudinary.com/dez3yjolk/image/upload/v1603378441/samples/kisspng-catering-food-computer-icons-logo-event-management-catering-5abf487cd18447_qcrvwi.png',
        badge: 'https://res.cloudinary.com/dez3yjolk/image/upload/v1603378441/samples/kisspng-catering-food-computer-icons-logo-event-management-catering-5abf487cd18447_qcrvwi.png'
      })
      webpush.sendNotification(endpoint, payload).catch(err => console.error(err));
    }
  } catch (e) {

  }

}


module.exports.confirmnotification = confirmnotification
module.exports.intransitnotification = intransitnotification
module.exports.deliverednotification = deliverednotification