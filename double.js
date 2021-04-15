console.clear();
var sha256 = require("js-sha256");

var salt = sha256(Math.random().toString() + Math.random().toString());
var roundnumber = Math.random().toString();
//Random 0-14
var result = Math.floor(roundnumber * 15);
var roundhash = sha256(roundnumber + salt);

// Verification
var ver_salt =
  "f63bb2cc980a39ea5a3f672585a81ab2bdb45e2f901973314cb4b549eb45c6ff";
var ver_roundnumber = "0.3152756639264964";
var ver_result = Math.floor(ver_roundnumber * 15);
var var_roundhash = sha256(ver_roundnumber + ver_salt);

console.log(`Result = ${ver_result}, Round Hash ${var_roundhash}`);
// a9b26fbf8f670b888184c993dbd9bf2c6b1127ece941a40b0fe1e93f181e10dd

console.log("Round Hash", roundhash);
console.log("Hash salt", salt);
console.log("roundnumber", roundnumber);
console.log("result", result);
