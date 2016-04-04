// TODO:
// =========================
// - resize event
// - give size back 
// - help ersonse on faulty input


var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
    // smartCSR: true,
    // fastCSR: true,
    // useBCE: true,
    // terminal: 'xterm-256color',
    // fullUnicode: true,
    title: 'ascii-flut',
    style: {
        fg: 'black',
        bg: 'red'
    },
    log: './debug.log'
});




function renderLoop() {
    screen.render()
    // console.log(pixelBuffer)

    screen.log(pixelBuffer[0].children.length)
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
        invisible: false,
        transparent: false,
        content: content || '',
        index:10,
        style: {
            bold: true,
            bg: bgcolor || '#000000',
            fg: fgcolor || '#000000'
        }
    })
    setPixelBufferWithPixel(pixel)
}

var hexToRGB = function(hex) {
  if (hex.length === 4) {
    hex = hex[0]
      + hex[1] + hex[1]
      + hex[2] + hex[2]
      + hex[3] + hex[3];
  }

  var col = parseInt(hex.substring(1), 16)
    , r = (col >> 16) & 0xff
    , g = (col >> 8) & 0xff
    , b = col & 0xff;

  return [r, g, b];
}

function updatePixel(x, y, bgcolor, content, fgcolor) {
    var pixel = getPixelBufferWithCoords(x, y)
    if (content) {
        if (String(content) === 'false') {
            content = 'clear'
        } else {
            content = content && content.toString().substr(0, 1)
        }
    }
    // screen.log(x, y, color, content)
    if (!pixel) {
        createPixel(x, y, bgcolor, content, fgcolor)
    } else {
        screen.log(bgcolor)
        if (bgcolor) {
            // var bgRGB = hexToRGB(bgcolor)
            
            // if (bgRGB) {
            //     pixel.style.bg = 'rgba('+bgRGB[0]+','+bgRGB[1]+','+bgRGB[2]+',100)'
            // } 
            pixel.style.bg = bgcolor
        }
        if (fgcolor) pixel.style.fg = fgcolor
        if (content) pixel.setContent(content)
        if (content === 'clear') pixel.setContent('')
        // screen.log(x, y, bgcolor, content, fgcolor, pixel.style)
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
        var x = parseInt(params[1])
        var y = parseInt(params[2])
        if (x >= screen.cols || y >= screen.rows || x < 0 || y < 0) return
        if (f === "PX") {
            var bgcolor = String(params[3]) ? '#' + String(params[3]) : false
            if (params.length === 4) {
                updatePixel(x, y, bgcolor, false, false)
            } else {
                var content = String(params[4]) || false
                var fgcolor = String(params[5]) ? '#' + String(params[5]) : false
                updatePixel(x, y, bgcolor, content, fgcolor)
            }
        } else if (f === "TX") {
            var content = String(params[3]) || false
            var fgcolor = String(params[4]) ? '#' + String(params[4]) : false
            updatePixel(x, y, false, content, fgcolor)
        } else if (f === "FG") {
            var fgcolor = String(params[4]) ? '#' + String(params[4]) : false
            updatePixel(x, y, false, false, fgcolor)
        }
    }
}

// initalize/render black background
blackRender()

var info = blessed.element({
    parent: screen,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 1,
    content: 'asciiflut 0.0.0.0:1234',
    index: 5,
    style: {
        bg: '#272727',
        fg: '#262626'
    }
})



// tc p server
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
            server.getConnections(function(err, count) {
                if (!err && count) {
                    info.setContent('asciiflut '+server.address().address+':1234 Connections:' + count)
                }
            })
        }
    });

})

server.listen({
    port: 1234,
    host: '0.0.0.0'
}, function() {
    address = server.address();
    console.log('opened server on %j', address);
    // Render the screen.
    screen.render();
    info.setContent('asciiflut '+server.address().address+':1234')
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});


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

var fps = require('fps')
var ticker = fps({
    every: 10 // update every 10 frames 
})
var fpsInfo = blessed.element({
    parent: screen,
    right: 0,
    bottom: 0,
    width: 3,
    height: 1,
    content: 'FPS',
    style: {
        bg: '#666666',
        fg: '#ffffff'
    }
})
ticker.on('data', function(framerate) {
    // console.log('dataaa',framerate)
    fpsInfo.setContent(String(parseInt(framerate)))
        // screen.render()
})





















var http = require('http'),
    path = require('path'),
    url = require('url'),
    Canvas = require('canvas'),
    fs = require('fs'),
    stream = require('stream')

var passThrough = new stream.PassThrough()

renderRate = 1000 / 0.5
renderInterval = null

scaleFactor = 10
cw = 64
ch = 32

canvas = new Canvas(cw*scaleFactor, ch*scaleFactor)
ctx = canvas.getContext('2d')
var config = {
    port: 1235
}

  // style: { bg: '#007256', fg: '#000000' },
  // content: '',

function renderedImage() {
    ctx.save();
    ctx.translate(0, 0);
    for (var row = 0; row < ch; row++){
        for (var col = 0; col < cw; col++){
            var pixel = getPixelBufferWithCoords(col,row)
            var bg = pixel.style.bg
            var fg = pixel.style.fg
            var content = pixel.content || ''
            
            ctx.fillStyle = bg;
            ctx.fillRect( col*scaleFactor, row*scaleFactor, 1*scaleFactor, 1*scaleFactor )

            // ctx.strokeStyle = fg;
            ctx.font = "10pt verdana";
            ctx.fillStyle = fg;
            ctx.fillText(content, col*scaleFactor, row*scaleFactor);
        }
    }
    ctx.restore()
    return canvas.toBuffer()
}

var maxFPS = 30
var lastFile = null
var lastFileLength = 0

var boundary = 'harkharkharkharkharkharkharkharkharkharkharkhark';



http.createServer(function(req, res) {
    var uri = url.parse(req.url).pathname;
    if (uri == '/img.mjpeg') {
        res.useChunkedEncodingByDefault = false;
        res.writeHead(200, { 'Content-type': 'multipart/x-mixed-replace; boundary=--' + boundary }, { 'Cache-Control': 'no-cache' }, { 'Connection': 'keep-alive' }, { 'Pragma': 'no-cache' });
        var updateLoop = setInterval(function() {
            parseBuffer(res, 'img.mjpeg')
        }, 1000 / maxFPS);
        res.on('close', function() {
            clearInterval(updateLoop);
        });
    } else {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end('<html><body style="width:100%;height:100%;padding:0px;margin:0px;background:black;"><img src="/img.mjpeg" style="width:100%;height:auto;"></body></html>');
    }
}).listen(config.port);

var parseBuffer = function(res, imgpath) {
    var imgbuffer = renderedImage();
    if (imgbuffer.length > 10) {
        res.write('Content-Type: image/jpeg\r\nContent-Length: ' + (imgbuffer.length) + '\r\n\r\n');
        res.write(imgbuffer);
        res.write('\r\n--' + boundary + '\r\n');
    } else {
        console.log('dropped')
    }
}

console.log('listening on port ' + config.port);