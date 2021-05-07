const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    cors: {
      origin: '*',
    }
  })

const port = process.env.PORT || 5000;

 


io.on('connection',  function(socket) {
    socket.on('join_room',({room_id}) =>{
        socket.join(room_id)
    })


    //Sending Live Location of deliveryagent to user
    socket.on('sendLocation2server', (data) => {
        socket.to(data.room_id).emit('sendLocation2client',data)    
    });


    //Chat betweent Restaurant and user
    socket.on('sendMessage2restaurant', (data) => {
      socket.to(data.room_id).emit('getMessageFromRestaurant',data) 
    });

    socket.on('sendMessage2user', (data) => {
      socket.to(data.room_id).emit('getMessageFromUser',data) 
    });


    //Notifies user on Order Update
    socket.on('sendUpdate2client', (data) => {
      socket.to(data.room_id).emit('receiveUpdateFromRestaurant',data) 
    });


    //Notifies restaurant on Order Update
    socket.on('sendUpdate2restaurant', (data) => {
      socket.to(data.room_id).emit('receiveUpdateFromDelivery',data) 
    });


    //Notifies restaurant if a order is placed
    socket.on('sendOrder2restaurant', (data) => {
      socket.to(data.room_id).emit('newOrderReceived',data) 
    });

    //Payment Update to restaurant -  List view
    socket.on('sendPaymentUpdateListView', (data) => {
      socket.to(data.room_id).emit('getPaymentUpdateListView',data) 
    });

    //Payment Update to restaurant - Detail view
    socket.on('sendPaymentUpdateDetailView', (data) => {
      socket.to(data.room_id).emit('getPaymentUpdateDetailView',data) 
    });




    //Notifies delivery agent for new delivery request

    socket.on('sendDeliveryRequest', (data)=>{
      socket.to(data.room_id).emit('getDeliveryRequest',data)
    });


});

http.listen(port)