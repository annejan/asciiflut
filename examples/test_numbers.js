// canvas 
var canvasWidth = 64  // width
var canvasHeight = 32   // height
var squareSize = 1
var colorRandomFactor = 50
var jumpFactor = 0.85 //0.95
px = parseInt(Math.floor(Math.random() * canvasWidth))
py = parseInt(Math.floor(Math.random() * canvasHeight))
hr = 0
hg = 0
hb = 0



var net = require('net');
var client = new net.Socket();
client.connect(1234, '0.0.0.0', function() {
    console.log('Connected');
    // random start positions
    // render loop
    // setInterval(renderLoop, 1000/15)
    // for (var row = 0; row < canvasHeight; row++){
    //     for (var col = 0; col < canvasWidth; col++) {
    //         var command = ''
    //         var c = String(col)
    //         c = c.substring(c.length,c.length-1)
    //         if (!row || !col) {
    //             command = 'PX ' + col-30 + ' ' + row + ' FF0000 false\n';
    //         } else if (row == canvasHeight-1 || col == canvasWidth -1) {
    //             command = 'PX ' + col + ' ' + row + ' 00FF00 false\n';
    //         } else if (row < canvasHeight || col < canvasWidth) {
    //             command = 'PX ' + col + ' ' + row + ' FF00FF false\n';
    //         } else {
    //             command = 'PX ' + col + ' ' + row + ' 0000FF false\n';
    //         }
    //         // console.log(command)
    //         client.write(command)
    //     }  
    // } 
    var c = 0
    for (var row = 0; row < canvasHeight; row++){
        var gray = c.toString(16)
        if (gray.length<2) {
            console.log(gray)
            gray = '0'+gray 
        }

        c++
        for (var col = 0; col < canvasWidth; col++) {
            var command = ''
            command = 'PX ' + col + ' ' + row + ' '+gray+gray+gray+'\n';
            // command = 'PX ' + col + ' ' + row + ' 000000 '+c+' '+gray+gray+gray+'\n';
            console.log(command)
            client.write(command)
            if (c>=256) c = 0
        }  
    } 
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




return 
for (var row = 0; row < canvasHeight; row++){
    for (var col = 0; col < canvasWidth; col++) {
        var command = ''
        var c = String(col)
        c = c.substring(c.length,c.length-1)
        if (!row) {
            command = 'PX ' + col + ' ' + row + ' 000000 ' + row + ' ff00ff\n';
        } else {
            command = 'PX ' + col + ' ' + row + ' 000000 ' + c + ' ff00ff\n';
        }
        // console.log(command)
        client.write(command)
    }  
} 
