// canvas 
var canvasWidth = 64/1 // width
var canvasHeight = 32/1 // height

var net = require('net');
var client = new net.Socket();
client.connect(1234, '192.168.1.99', function() {
    console.log('Connected');
    // random start positions
    // render loop
    setInterval(renderLoop, 1000 / 5)
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

function randomChar() {
    //33 - 126
    var startChar = 36
    var endChar = 126
    var dist = Math.floor(Math.random() * (endChar-startChar))
    return String.fromCharCode(startChar + dist)
}

var heads = []
var tails = []
for (var i = 0; i < canvasWidth; i++) {
    if (!heads[i]) heads[i] = Math.floor(Math.random() * canvasHeight)
    if (!tails[i]) tails[i] = Math.floor(Math.random() * canvasHeight*2)
}

renderLoop = function() {
    // draw square
    for (var i = 0; i < canvasWidth; i++) {
        heads[i]++
        if (heads[i]>canvasHeight*2) {
            heads[i] = -Math.floor(Math.random()*20)
            tails[i] = Math.floor(Math.random() * canvasHeight)+3
        }

    }
    var x = 0
    var y = 0
    var colorHead = "AAFFAA";
    var colorTail = "009900";
    var colorTailDark = "005500"
    for (var row = 0; row < canvasHeight; row++) {
        for (var col = 0; col < canvasWidth; col++) {
            x = col
            y = row

            // var changingTailColor = col % 2 ? colorTail : colorTailDark;
            var changingTailColor = colorTail;

            // background only
            // if (y === heads[col]) client.write('PX ' + x + ' ' + y + ' ' + colorHead + '\n');
            // if (y === heads[col] -1) client.write('PX ' + x + ' ' + y + ' ' + colorTail + '\n');
            // if (y === heads[col] - tails[col] -1 ) client.write('PX ' + x + ' ' + y + ' 000000\n');
            // text only
            if (y === heads[col]) client.write('TX ' + x + ' ' + y + ' ' + randomChar() + ' ' + colorHead + '\n');
            if (y === heads[col] -1) client.write('TX ' + x + ' ' + y + '  ' + changingTailColor + '\n');
            if (y === heads[col] - tails[col] -1 ) client.write('TX ' + x + ' ' + y + ' false\n');
        }
    }

    // console.log('done.')
}








