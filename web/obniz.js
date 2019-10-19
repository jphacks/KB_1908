var Obniz = require("obniz");
var obniz = new Obniz("5777-5866");

var srvDeg = (deg) => {
	var servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
	servo.angle(deg);
}