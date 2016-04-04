// canvas 
var canvasWidth = 64  // width
var canvasHeight = 32   // height
var squareSize = 2
var colorRandomFactor = 40
var jumpFactor = 0.95 //0.95
px = parseInt(Math.floor(Math.random() * canvasWidth))
py = parseInt(Math.floor(Math.random() * canvasHeight))
hr = 0
hg = 0
hb = 0



var net = require('net');
var client = new net.Socket();
client.connect(1234, '192.168.1.99', function() {
    console.log('Connected');
    // random start positions
    // render loop
    setInterval(renderLoop, 1000/30)
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


renderLoop = function() {
    // draw square
    for (var i = 0; i < squareSize; i++) {
        for (var k = 0; k < squareSize; k++) {
            var x = Math.round(px + i)
            var y = Math.round(py + k)
                //             PX     X         Y     BGCOLOR CHAR FGCOLOR █▓▒░┘
            var command = 'FG ' + x + ' ' + y + ' 000000\n';
            client.write(command);
        }
    }
    // move square
    px = px + Math.round(1 - Math.random() * 2) * squareSize * jumpFactor
    py = py + Math.round(1 - Math.random() * 2) * squareSize * jumpFactor
    if (px > canvasWidth + squareSize - 1) px = canvasWidth - squareSize;
    if (py > canvasHeight) py = canvasHeight - squareSize;
    if (px < 0) px++;
    if (py < 0) py++;
}
