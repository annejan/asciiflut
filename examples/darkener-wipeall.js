// canvas 
var canvasWidth = 64  // width
var canvasHeight = 32   // height

var net = require('net');
var client = new net.Socket();
client.connect(1234, '192.168.1.99', function() {
    console.log('Connected');
    setInterval(renderLoop, 1000/3)
})

client.on('data', function(data) {
    console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
})

client.on('error', function(err) {
    console.log(err)
})
client.on('close', function() {
    console.log('Connection closed');
})

runnerX = 0
renderLoop = function() {
    // draw line
    for (var i = 0; i < canvasWidth; i++) {
        var x = i + runnerX - canvasHeight -1
        var y = i
        var command = 'PX ' + x + ' ' + y + ' 000000 false 000000\n'
        client.write(command)
        // console.log(command)
    } 
    runnerX++
    if (runnerX>canvasWidth+canvasHeight)
        runnerX=0
}
