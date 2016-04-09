var osc = require('osc')

// Create an osc.js UDP Port listening on port 57121. 
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 23456
});
 
// Listen for incoming OSC bundles. 
udpPort.on("/blabla", function (oscBundle, timeTag, info) {
    console.log("An OSC bundle just arrived for time tag", timeTag, ":", oscBundle);
    console.log("Remote info is: ", info);
});
udpPort.on("message", function (oscBundle, timeTag, info) {
    console.log("An OSC message just arrived for time tag", timeTag, ":", oscBundle);
    console.log("Remote info is: ", info);
});
udpPort.on("osc", function (oscBundle, timeTag, info) {
    console.log("An OSC osc just arrived for time tag", timeTag, ":", oscBundle);
    console.log("Remote info is: ", info);
});
udpPort.on("raw", function (oscBundle, timeTag, info) {
    console.log("An OSC raw just arrived for time tag", timeTag, ":", oscBundle);
    console.log("Remote info is: ", info);
});
udpPort.on("error", function (oscBundle, timeTag, info) {
    console.log("An OSC error just arrived for time tag", timeTag, ":", oscBundle);
    console.log("Remote info is: ", info);
});
 
// Open the socket. 
udpPort.open();
 