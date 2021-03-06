
var net = require('net');
var cw = 64
var ch = 32
var squareSize = 3



var client = new net.Socket();
client.connect(1234, '192.168.1.99', function() {
  console.log('Connected');
  px = parseInt(Math.floor(Math.random()*cw))
  py = parseInt(Math.floor(Math.random()*ch))
  setInterval(function(){
    var rr = Math.floor(Math.random()*256).toString(16)
    if (rr.length === 1) rr = '0'+rr;
    var rg = Math.floor(Math.random()*256).toString(16)
    if (rg.length === 1) rg = '0'+rg;
    var rb = Math.floor(Math.random()*256).toString(16)
    if (rb.length === 1) rb = '0'+rb;
    for (var i=0; i<= squareSize; i++){
      for (var k=0; k<= squareSize; k++){
        var x = Math.round(px+i)
        var y = Math.round(py+k)
        var command = 'PX ' + x + ' ' + y + ' '+rr+rb+rg+'\n';
        client.write(command);
      }
    }
    px = px + Math.round(1 - Math.random()*2)*squareSize
    py = py + Math.round(1 - Math.random()*2)*squareSize
    if (px > cw + squareSize) px = px - squareSize;
    if (px < 0) px++;
    if (py > ch + squareSize) py = py - squareSize;
    if (py < 0) py++;
    // console.log(command)
  }, 0.1)
});

client.on('data', function(data) {
  console.log('Received: ' + data);
  client.destroy(); // kill client after server's response
});

client.on('error', function(err) {
   console.log(err)
})
client.on('close', function() {
  console.log('Connection closed');
});