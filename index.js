var net = require('net');
var CONSTANTS = require('./constants');

// send data to printer
var socket = new net.Socket();

socket.on('connect', function(){
  console.log("connected");
});

socket.on('close', function() {
  console.log('Connection closed');
});

socket.on('data', function(data) {
  var buff = Buffer.from(data);
  console.log(data);
});

socket.on('ready', function(){
  var initialPacket = [];
  initialPacket.push(CONSTANTS.ZERO_ARRAY);
  initialPacket.push(CONSTANTS.PTOUCH_RASTER_MODE);
  var payload = Buffer.concat(initialPacket);
  console.log("Initial Packet: "+payload.toString('hex').match(/../g).join(' '));
  socket.write(payload, function(err) {
    if (err) {
      return console.log(err);
    }else{
      var printPacket = [];
      // printPacket.push(CONSTANTS.INITIALIZE);
      // printPacket.push(CONSTANTS.PRINT_INFORMATION);
      // printPacket.push(CONSTANTS.CUT_MODE);
      // printPacket.push(CONSTANTS.ENABLE_CUT_MODE);
      // printPacket.push(CONSTANTS.AUTO_CUT);
      // printPacket.push(CONSTANTS.UNKNOWN);
      // printPacket.push(CONSTANTS.MARGIN);
      printPacket.push(CONSTANTS.TEST_IMAGE_TWO);
      var printPayload = Buffer.concat(printPacket);
      socket.write(printPayload, function(err) {
        if (err) {
          return console.log(err);
        }else{
          console.log("print packet: "+printPayload.toString('hex').match(/../g).join(' '));
          socket.write(CONSTANTS.EXIT_RASTER_MODE, function(err){
            if(err){
              return console.log(err);
            }else{
              console.log("exit raster complete");
              socket.destroy();
            }
          });
        }
      });
    }
  });
});

socket.connect(9100, '192.168.0.50', function(err) {
  if (err) {
    return console.log(err);
  }
});
