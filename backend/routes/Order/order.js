const router = require('express').Router();
const checksum_lib = require("./checksum");
const config = require("./config");
const https = require('https')
const verify = require('./verifyToken')
const { orderValidation } = require('../../validation/order_validation');
const Order = require('../../models/Order/order')
const Restaurant = require('../../models/Restaurant/Restaurant')
var mongoose = require('mongoose');
const io = require('socket.io-client')
const socket = io("http://192.168.29.82:5000/");
const { confirmnotification, deliverednotification } = require('../../components/notification')

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
router.post("/", async (req, res) => {
  const orderobject = JSON.parse(req.body.orderobject)
  orderobject['phone'] = parseInt(req.body.phone)
  const { error } = orderValidation(orderobject)
  if (error) {
    return res.status(400).send("<html><head><title>Payment Error</title></head><body><center style='margin-top: 35vh'><img width='200px' height='100px' src='https://res.cloudinary.com/dez3yjolk/image/upload/v1606915138/samples/paytm_adizu7.svg' alt='paytm' /><h2 style='color: #012b74'>Payment Gatway error<h2></center></body></html>")
  }

  const order = new Order(orderobject)

  try {
    await order.save();
    socket.emit('sendOrder2restaurant', { room_id: orderobject.owner_id })

  } catch (e) {
    return res.status(400).send("<html><head><title>Payment Error</title></head><body><center style='margin-top: 35vh'><img width='200px' height='100px' src='https://res.cloudinary.com/dez3yjolk/image/upload/v1606915138/samples/paytm_adizu7.svg' alt='paytm' /><h2 style='color: #012b74'>Payment Gatway error<h2></center></body></html>")
  }


  // Route for making payment

  var paymentDetails = {
    amount: req.body.amount,
    customerId: req.body.name,
    customerEmail: req.body.email,
    customerPhone: req.body.phone
  }
  if (!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
    try {
      await Order.findOneAndUpdate({ order_id: orderobject.order_id }, { payment_status: 'Payment faild', order_status: 'Order Cancelled', })
      socket.emit('sendOrder2restaurant', { room_id: orderobject.owner_id })
    } catch (e) { }
    return res.status(400).send("<html><head><title>Payment Error</title></head><body><center style='margin-top: 35vh'><img width='200px' height='100px' src='https://res.cloudinary.com/dez3yjolk/image/upload/v1606915138/samples/paytm_adizu7.svg' alt='paytm' /><h2 style='color: #012b74'>Payment Gatway error<h2></center></body></html>")

  } else {
    var params = {};
    params['MID'] = config.PaytmConfig.mid;
    params['WEBSITE'] = config.PaytmConfig.website;
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = 'TEST_' + new Date().getTime();
    params['CUST_ID'] = paymentDetails.customerId;
    params['TXN_AMOUNT'] = paymentDetails.amount;
    params['CALLBACK_URL'] = `http://192.168.29.82:3001/api/order/callback?order_id=${orderobject.order_id}&owner_id=${orderobject.owner_id}`;
    params['EMAIL'] = paymentDetails.customerEmail;
    params['MOBILE_NO'] = paymentDetails.customerPhone;


    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
      var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
      // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

      var form_fields = "";
      for (var x in params) {
        form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
      }
      form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
      res.end();
    });
  }
});


router.post("/callback", (req, res) => {
  //   console.log("---------------------------------------------")
  //   console.log(req.body)
  //   console.log("---------------------------------------------")
  //   res.send("Payment done")




  //-------------------------------------------------------------------------------------------------------------------
  var post_data = req.body
  // received params in callback
  //    console.log('Callback Response: ', post_data, "\n");


  // verify the checksum
  var checksumhash = post_data.CHECKSUMHASH;
  // delete post_data.CHECKSUMHASH;
  var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
  //    console.log("Checksum Result => ", result, "\n");


  // Send Server-to-Server request to verify Order Status
  var params = { "MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID };

  checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {

    params.CHECKSUMHASH = checksum;
    post_data = 'JsonData=' + JSON.stringify(params);

    var options = {
      hostname: 'securegw-stage.paytm.in', // for staging
      // hostname: 'securegw.paytm.in', // for production
      port: 443,
      path: '/merchant-status/getTxnStatus',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
    }


    // Set up the request
    var response = "";
    var post_req = https.request(options, function (post_res) {
      post_res.on('data', function (chunk) {
        response += chunk;
      })

      post_res.on('end', async function () {
        //  console.log('S2S Response: ', response, "\n")
        var html_body = ''
        var _result = JSON.parse(response)
        if (_result.STATUS == 'TXN_SUCCESS') {
          try {
            await Order.findOneAndUpdate({ order_id: req.query.order_id }, { payment_status: 'Payment Success' })
            socket.emit('sendPaymentUpdateListView', { room_id: req.query.owner_id })
            socket.emit('sendPaymentUpdateDetailView', { room_id: req.query.order_id })
          } catch (e) { }
          const html = `
                <html>
                <head>
                <title>Payment Status</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="preconnect" href="https://fonts.gstatic.com">
		            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300&display=swap" rel="stylesheet">
                </head>
                <body>
		
                <div style="padding:36px;font-family: 'Roboto', sans-serif;">
                <center>
                <img width='100px' height='50px' src='https://res.cloudinary.com/dez3yjolk/image/upload/v1606915138/samples/paytm_adizu7.svg' alt='paytm' />
		
	          	  <br><br>
		
        	      <img src="https://res.cloudinary.com/dez3yjolk/image/upload/v1612421588/samples/check_y5tcdw.svg" width="50px" height="50px" alt='success'>
                &nbsp;&nbsp;&nbsp;&nbsp;            
                <h2 style="color:#002d8b ">Payment Success</h2>
            
                

                <div style="color: #002d8b; background : rgba(128,237,153, 0.1); border-radius: 12px; padding:16px; max-width: 300px; 	border: 2px solid #002d8b">
                <p><strong>Amount:</strong> ₹ ${_result.TXNAMOUNT}</p>
                <p><strong>Merchant:</strong> FooDE online.</p> 
                <p><strong>Date:</strong> ${_result.TXNDATE}</p> 
                <p><strong>Paymeny status:</strong> ${_result.STATUS}</p> 

                </div>
                      
                <img alt='loading' width="100px" height="50px" src="https://res.cloudinary.com/dez3yjolk/image/upload/v1612422925/samples/loading_is6ssp.svg" />
                            <p>Redirecting, Please wait</p>
                </center>
                    </div>
                    <script type="text/javascript">
                    window.onload = function(){  
                      setTimeout(function(){ window.close() }, 3000);
                    }
                </script>
                </body>
                </html>`

          res.send(html)
        } else {

          try {
            await Order.findOneAndUpdate({ order_id: req.query.order_id }, { payment_status: 'Payment failed', order_status: 'Order Cancelled' })
            socket.emit('sendPaymentUpdateListView', { room_id: req.query.owner_id })
            socket.emit('sendPaymentUpdateDetailView', { room_id: req.query.order_id })

          } catch (e) { }
          const html = `
          <html>
          <head>
          <title>Payment Status</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.gstatic.com">
		      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300&display=swap" rel="stylesheet">
          </head>
          <body>

          <div style="padding:36px;font-family: 'Roboto', sans-serif;">
          <center>
          <img width='100px' height='50px' src='https://res.cloudinary.com/dez3yjolk/image/upload/v1606915138/samples/paytm_adizu7.svg' alt='paytm' />

          <br><br>

          <img src="https://res.cloudinary.com/dez3yjolk/image/upload/v1612421588/samples/close_hejuow.svg" width="50px" height="50px" alt='success'>
          &nbsp;&nbsp;&nbsp;&nbsp;            
          <h2 style="color:#002d8b ">Payment Failed</h2>
      
          

          <div style="color: #002d8b; background : rgba(215,38,61, 0.1); border-radius: 12px; padding:16px; max-width: 300px; 	border: 2px solid #002d8b">
          <p><strong>Amount:</strong> ₹ ${_result.TXNAMOUNT}</p>
          <p><strong>Merchant:</strong> FooDE online.</p> 
          <p><strong>Date:</strong> ${_result.TXNDATE}</p> 
          <p><strong>Paymeny status:</strong> ${_result.STATUS}</p> 

          </div>
                
          <img alt='loading' width="100px" height="50px" src="https://res.cloudinary.com/dez3yjolk/image/upload/v1612422925/samples/loading_is6ssp.svg" />
                      <p>Redirecting, Please wait</p>
          </center>
              </div>
              <script type="text/javascript">
              window.onload = function(){  
                setTimeout(function(){ window.close() }, 3000);
              }
          </script>
          </body>
          </html>`
          res.send(html)
        }
      });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
  })
})



router.post("/addOrder", verify, async (req, res) => {
  const { error } = orderValidation(req.body)
  if (error) {
    return res.status(400).json({ 'error': error.details[0].message })
  }
  const order = new Order(req.body)
  try {
    const savedorder = await order.save();
    socket.emit('sendOrder2restaurant', { room_id: req.body.owner_id })
    res.json({ '_id': savedorder._id })

  } catch (e) {

    res.status(400).json({ 'error': "Network error" });
  }
})


router.post("/addMessage", verify, async (req, res) => {
  try {
    await Order.findOneAndUpdate({ order_id: req.body.order_id }, {
      $push: {
        custom_chat: { by: req.body.by, message: req.body.message }
      }
    })
    if( req.body.by === 'user'){
      socket.emit('sendMessage2user', {room_id: req.body.order_id,by: 'user', message: req.body.message})
      
    }else{
      socket.emit('sendMessage2restaurant', {room_id: req.body.order_id,by: 'restaurant', message: req.body.message})
    } 
   
   
    res.status(200).json({ 'message': 'Sent' })

  } catch (e) {
    res.status(400).json({ 'error': 'Network error' })
  }
})




router.get("/getOrderbyid", verify, async (req, res) => {


  try {
    const orderExists = await Order.findOne({ order_id: (req.query.order_id) })
    if (orderExists)
      return res.send(orderExists)
    else
      return res.status(400).json({ 'error': "No such order" })
  } catch {
    return res.status(400).json({ 'error': "Network error" })
  }
})

router.get("/getOrderbyidv2", verify, async (req, res) => {


  try {
    const orderExists = await Order.aggregate([
      {
        '$match': {
          'order_id': req.query.order_id
        }
      }, {
        '$lookup': {
          'from': 'restaurants',
          'localField': 'restaurant_id',
          'foreignField': '_id',
          'as': 'restaurant'
        }
      }
    ])
    if (orderExists.length >= 1)
      return res.send(orderExists[0])
    else
      return res.status(400).json({ 'error': "No such order" })
  } catch {
    return res.status(400).json({ 'error': "Network error" })
  }
})





router.post("/changestatus", verify, async (req, res) => {

  try {
    const orderExists = (req.body.change_payment) ?
      (await Order.findOneAndUpdate({ order_id: req.body.order_id }, { order_status: req.body.order_status, payment_status: 'Refund initiated' })) :
    
      (await Order.findOneAndUpdate({ order_id: req.body.order_id }, { order_status: req.body.order_status }))
      
    
      

    if (orderExists) {
      
      
      socket.emit('sendUpdate2client', {room_id: req.body.order_id})

      if( req.body.order_status === 'Order Confirmed'){
        confirmnotification(orderExists.user_id)
      }

      if(req.body.order_status === 'Delivered'){
        socket.emit('sendUpdate2restaurant', {room_id: req.body.order_id})
        deliverednotification(orderExists.user_id)
      }

      return res.send(orderExists)

    }

    else
      return res.status(400).json({ 'error': "No such order" })
  } catch {
    return res.status(400).json({ 'error': "Network error" })
  }
})


router.get("/getRestaurantorder", verify, async (req, res) => {
  try {
    const orderList = await Restaurant.aggregate([
      {
        '$match': {
          'owner_id': mongoose.Types.ObjectId(req.user._id)
        }
      }, {
        '$limit': 1
      }, {
        '$lookup': {
          'from': 'orders',
          'localField': '_id',
          'foreignField': 'restaurant_id',
          'as': 'orders'
        }
      }, {
        '$project': {
          '_id': 0,
          'orders': 1
        }
      }
    ]

    )
    if (orderList[0].orders.length <= 0)
      return res.status(400).json({ 'error': "No orders" })
    else {
      return res.send(orderList[0].orders)
    }

  } catch {
    return res.status(400).json({ 'error': "Network error" })
  }



})

router.get("/getOrderbyuserid", verify, async (req, res) => {

  const lim = 5
  const page_no = req.query.page_no
  const off_set = (page_no-1)*lim
  try {
    const orderExists = await Order.aggregate([
      {
        '$match': {
          'user_id': mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        '$project': {
          'order_id': 1,
          'restaurant_name': 1,
          'order_status': 1,
          'time': 1
        }
      }
    ]
    )
    .sort({ _id: -1 })
    .skip(off_set)
    .limit(lim)
    
    
   
    return res.send(orderExists)
    
  } catch {
    return res.status(400).json({ 'error': "Network error" })
  }
})



module.exports = router