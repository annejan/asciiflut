//https://www.npmjs.com/package/osc
var osc = require('osc')

// Create the port
var udpPort = new osc.UDPPort({
	localAddress: "0.0.0.0",
	localPort: 12321
});

// Open the socket. 
udpPort.open();

// Send an OSC message
udpPort.send({
	timeTag: osc.timeTag(10),
	packets: [{
		address: "/blabla",
		args: {
			x: 0,
			y: 0,
			bgcolor: '#000000',
			fgcolor: '#000000',
			content: 'x'
		}
	}]
}, "127.0.0.1", 23456);