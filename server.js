// TODO:
// =========================
// - resize event
// - give size back 
//


var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
    smartCSR: false,
    title: 'ascii-flut',
    style: {
        fg: 'black',
        bg: 'red'
    },
    log: './debug.log'
});




function renderLoop() {
    screen.render()
    // blackRender()
    ticker.tick()
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
            var r = '00'
            var g = '00'
            var b = '00'
            var color = '#' + String(r) + String(g) + String(b)
            updatePixel(col, row, color)
        }
    }
}

function numbersRender() {
    for (var row = 0; row < screen.rows; row++) {
        for (var col = 0; col < screen.cols; col++) {
            var r = '00'
            var g = '00'
            var b = '00'
            var color = '#' + String(r) + String(g) + String(b)
            // console.log(row)
            var rowChar = String(row).split('').pop()
            var colChar = String(col).split('').pop()
            if (!row) 
                rowChar = colChar
            updatePixel(col, row, color, rowChar)
        }
    }
}

function createPixel(x, y, bgcolor, content, fgcolor) {
    var pixel = blessed.element({
        parent: screen,
        top: y,
        left: x,
        width: 1,
        height: 1,
        content: content || '',
        style: {
            bg: bgcolor,
            fg: bgcolor
        }
    })
    setPixelBufferWithPixel(pixel)
}

function updatePixel(x, y, bgcolor, content, fgcolor) {
    var pixel = getPixelBufferWithCoords(x, y)
    content = content ? content.toString().substr(0, 1) : '' 
    // screen.log(x, y, color, content)
    if (!pixel) {
        createPixel(x, y, bgcolor, content, fgcolor)
    } else {
        pixel.style.bg = bgcolor
        pixel.style.fg = fgcolor
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
    if (params && params.length >= 4 && params.length <= 6) {
        var f = params[0].toString()
        var x = parseInt(params[1]) - 1
        var y = parseInt(params[2]) - 1
        var bgcolor = '#' + params[3].toString()
        if (params.length === 4){
            updatePixel(x, y, bgcolor)
        } else {
            var fgcolor = '#' + String(params[5])
            var content = params[4] && params[4].toString() || ''
            updatePixel(x, y, bgcolor, content, fgcolor)
        }
    }
}

// initalize/render black background
blackRender()

var info = blessed.element({
        parent: screen,
        top: 0,
        left: 0,
        width: '100%',
        height: 1,
        content: 'asciiflut 192.168.1.99:1234',
        style: {
            bg: '#666666',
            fg: '#000000'
        }
    })



// tcp server
var net = require('net');
var server = net.createServer(function(socket) {
    // socket.end('goodbye\n');
    socket.on('error', function(err) {
        // handle errors here
        // console.log(err)
        // throw err;
    });
    socket.on('data', function(data) {
        if (data) {
            var packets = data.toString().split('\n')
            for (var i = 0; i < packets.length; i++) {
                updatePixelWithString(packets[i])
            }
        }
    });

})

server.listen({
    port: 1234,
    host: '0.0.0.0'
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





// "libs"



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








// test stuff


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
//     right: 0,
//     top: 0,
//     width: 3,
//     height: 1,
//     style: {
//         fg: 'red',
//         bg: 'black'
//     },
//     index: 2
// })

var fps = require('fps')
var ticker = fps({
    every: 10 // update every 10 frames 
})
var fpsInfo = blessed.element({
    parent: screen,
    right: 0,
    top: 0,
    width: 3,
    height: 1,
    content: 'FPS'
})
ticker.on('data', function(framerate) {
    // console.log('dataaa',framerate)
    fpsInfo.setContent(String(parseInt(framerate)))
    // screen.render()
})







