// canvas 
var canvasWidth = 64  // width
var canvasHeight = 30   // height
var squareSize = 1
var colorRandomFactor = 50
var jumpFactor = 0.85 //0.95

var net = require('net');
var client = new net.Socket();
client.connect(1239, '192.168.1.99', function() {
    console.log('Connected');
    var c = 0
    for (var row = 0; row < canvasHeight; row++){
        for (var col = 0; col < canvasHeight/3; col++){
            var gray = c.toString(16)
            if (gray.length<2) {
                gray = '0'+gray 
            }

            var command = ''
            command = 'PX '+col*3+' ' + row + ' '+gray+gray+gray+'\n';
            // command = 'PX ' + col + ' ' + row + ' 000000 '+c+' '+gray+gray+gray+'\n';
            console.log(gray,command)
            var bgcolorstr = ''+gray+gray+gray
            var bgcolor = bgcolorstr.split('')
            command += 'PX '+(col*3+1)+' ' + row + ' 000000 '+bgcolor[0]+' '+bgcolorstr+'\n';
            command += 'PX '+(col*3+2)+' ' + row + ' 000000 '+bgcolor[1]+' '+bgcolorstr+'\n';
            client.write(command)
            c++
            if (c>=255) c=0
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
