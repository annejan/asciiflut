var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
    smartCSR: false,
    title: 'ascii-flut',
    style: {
        fg: 'black',
        bg: 'red'
    }
});

// Add a png icon to the box
// var icon = blessed.image({
//     parent: screen,
//     top: '20%',
//     left: '20%',
//     type: 'ansi',
//     width: '60%',
//     height: '60%',
//     file: __dirname + '/splash.png',
//     search: false
// });


// var overlay = blessed.element({
//     parent: screen,
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: 1,
//     style: {
//         fg: 'white',
//         bg: 'red'
//     },
//     index: 2
// })

// var fps = require('fps')
// var ticker = fps({
//     every: 10 // update every 10 frames 
// })
// var fpsInfo = blessed.element({
//     parent: overlay,
//     top: 0,
//     left: 0,
//     content: 'FPS'
// })
// ticker.on('data', function(framerate) {
//     // console.log('dataaa',framerate)
//     fpsInfo.setContent(String(parseInt(framerate)))
//     screen.render()
// })




function randomHex() {
    var hex = (parseInt(Math.random() * 254)).toString(16)
    if (hex.length < 2) {
        hex = '0' + hex
    }
    return hex
}

function randomColor() {
    var r = randomHex()
    var g = randomHex()
    var b = randomHex()
    return '#' + r + g + b

}



function renderLoop() {
    screen.render()
    blackRender()
        // ticker.tick()
}

setInterval(renderLoop, 1000 / 30)

console.log(screen.cols, screen.rows)

var pixelBuffer = []

function randomRender() {
    for (var row = 0; row < screen.rows; row++) {
        for (var col = 0; col < screen.cols; col++) {
            var color = randomColor()
            updatePixel(col, row, color)
        }
    }
}

function blackRender() {
    for (var row = 0; row < screen.rows; row++) {
        for (var col = 0; col < screen.cols; col++) {
            var r = 'ff'
            var g = '00'
            var b = '00'
            var color = '#' + String(r) + String(g) + String(b)
            updatePixel(col, row, color, row)
        }
    }
}

function createPixel(x, y, color, content) {
    var pixel = blessed.element({
        parent: screen,
        top: y,
        left: x,
        width: 1,
        height: 1,
        content: content || '',
        style: {
            bg: color
        }
    })
    setPixelBufferWithPixel(pixel)
}

function updatePixel(x, y, color, content) {
    var pixel = getPixelBufferWithCoords(x, y)
    content = content.toString() && content.toString().substr(0, 1) || ''
    if (!pixel) {
        createPixel(x, y, color, content)
    } else {
        pixel.style.bg = color
        pixel.setContent(content)
    }
}

function getPixelBufferWithCoords(x, y) {
    return pixelBuffer[y * screen.cols + x]
}

function setPixelBufferWithPixel(pixel) {
    // pixel as in a blessed.element
    pixelBuffer[pixel.top * screen.cols + pixel.left] = pixel
}

function updatePixelWithString(str) {
    var params = str.toString().split(' ')
        // console.log(params)
    if (params && params.length === 4) {
        var f = params[0].toString()
        var x = parseInt(params[1]) - 1
        var y = parseInt(params[2]) - 1
        var color = params[3].toString()
        if (f === 'PX' && x && y && color) {
            updatePixel(x, y, '#' + color, x.toString().substr(0, 1))
                // fpsInfo.setContent(str)
        }
    }
    // fpsInfo.setContent(" " + x + " " + y + " " + color)
}
blackRender()
    // setInterval(randomRender,1000/30)



// tcp server
var net = require('net');
var server = net.createServer(function(socket) {
    // socket.end('goodbye\n');
    socket.on('error', function(err) {
        // handle errors here
        console.log(err)
        throw err;
    });
    socket.on('data', function(data) {
        var packets = data.toString().split('\\\n')
        for (var i = 0; i < packets.length; i++) {
            updatePixelWithString(packets[i])
        }
    });
})

server.listen({
    port: 1234,
    host: 'localhost'
}, function() {
    address = server.address();
    console.log('opened server on %j', address);
});











// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

// Render the screen.
screen.render();