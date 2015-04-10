// var connect = require('connect');
// var serveStatic = require('serve-static');
// var hue = require("./hue/index.js");
var io = require('socket.io')();
var calendar = require('./calendar.js');
var hue = require("./hue/index.js");
// var open = require('open');

var root = __dirname.replace("server", "");

var port = 9679;

var connections = [];

//SOCKET CONNECTION
io.on('connection', function(socket){
	
  socket.on('authenticate', function(data){  	
  	calendar.authenticate(function( url ){
      socket.emit('authentication_url', url);
    });
  });

  socket.on('got_code', function(data){
  	calendar.useCode( data );
  });

  socket.on('set_room_data', function(data){
    calendar.setRoomData( data );
  });

  calendar.setUpdateCallback(function(key, data){

      socket.emit("updateData", { key : key, data : data });
  });

  socket.on('requestData', function(){
    calendar.request();
  });

  // socket.on('hue_connection', function( id ){
  //   connections.push( id );
  // });

  socket.on('update_data', function(data){
    console.log("!!", data)
    hue.updateLights( data );
  });

});

io.listen(3000);
