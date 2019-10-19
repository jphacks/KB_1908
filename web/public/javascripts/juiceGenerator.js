let Obniz = require("obniz");
let obniz = new Obniz("5777-5866");
let driver = obniz.wired("PCA9685", {
    gnd: 0,
    oe: 1,
    scl: 2,
    sda: 3,
    vcc: 4
});
// 024 本体を上から見たときのボトルの順番
// 135
let srv0 = obniz.wired("ServoMotor", {
    pwm: driver.getPWM(0)
}); // オレンジ
let srv1 = obniz.wired("ServoMotor", {
    pwm: driver.getPWM(1)
}); // ジャスミン
let srv2 = obniz.wired("ServoMotor", {
    pwm: driver.getPWM(2)
}); // エナドリ
let srv3 = obniz.wired("ServoMotor", {
    pwm: driver.getPWM(3)
}); // 栄養ドリ
​
// test =====
var servo = obniz.wired("ServoMotor", {
    gnd: 0,
    vcc: 1,
    signal: 2
});
// ==========
​
// 弁を開いている単位時間 Unit Time [ms]
const UT = 2000;​
// OPENの角度
const ODEG = 0;
// CLOSEの角度
const CDEG = 110;​
// バルブ初期化：srv渡す必要ないけど時間ないから許して
closeVlv(srv0);
closeVlv(srv1);
closeVlv(srv2);
closeVlv(srv3);​​
const test = () => {
    servo.angle(ODEG);​
    setTimeout(() => {
        closeVlv(servo);
    }, UT * 1);
}​​
const brewO = () => {
    srv0.angle(ODEG);​
    setTimeout(() => {
        closeVlv(srv0);
    }, UT * 4);
}​
const brewVO = () => {
    srv0.angle(ODEG);
    srv3.angle(ODEG);​
    setTimeout(() => {
        closeVlv(srv0);
    }, UT * 2);
    setTimeout(() => {
        closeVlv(srv3);
    }, UT * 2);
}​
const brewJ = () => {
    srv1.angle(ODEG);​
    setTimeout(() => {
        closeVlv(srv1);
    }, UT * 4);
}​
const brewEV = () => {
    srv2.angle(ODEG);
    srv3.angle(ODEG);​
    setTimeout(() => {
        closeVlv(srv2);
    }, UT * 3);
    setTimeout(() => {
        closeVlv(srv3);
    }, UT * 1);
}​
const brewOJEV = () => {
    srv0.angle(ODEG);
    srv1.angle(ODEG);
    srv2.angle(ODEG);
    srv3.angle(ODEG);​
    setTimeout(() => {
        closeVlv(srv0);
    }, UT * 1);
    setTimeout(() => {
        closeVlv(srv1);
    }, UT * 1);
    setTimeout(() => {
        closeVlv(srv2);
    }, UT * 1);
    setTimeout(() => {
        closeVlv(srv3);
    }, UT * 1);
}​
const closeVlv = (s) => {
    s.angle(CDEG);
}​
// オレンジジュース（O），ジャスミンティー（J），エナジードリンク（E），栄養ドリンク（V）
// 1 オレンジだけ
// 2 栄養ドリンク＋オレンジ（1:1）
// 3 ジャスミンティーだけ
// 4 エナジードリンクと栄養ドリンク（3:1）
// 5 全部(1:1:1:1)