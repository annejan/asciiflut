var net = require('net');
var cw = 57
var ch = 24
var squareSize = 2
px = parseInt(Math.floor(Math.random() * cw))
py = parseInt(Math.floor(Math.random() * ch))



var client = new net.Socket();
client.connect(1234, 'localhost', function() {
    console.log('Connected');
    // random start positions
    // render loop
    setInterval(renderLoop, 100)
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
            var command = 'PX ' + x + ' ' + y + ' FF0000 ░ 0000FF\n';
            client.write(command);
        }
    }
    // move square
    px = px + Math.round(1 - Math.random() * 2) * squareSize
    py = py + Math.round(1 - Math.random() * 2) * squareSize
    if (px > cw + squareSize) px = cw - squareSize;
    if (py > ch) py = ch - squareSize;
    if (px < 0) px++;
    if (py < 0) py++;
}