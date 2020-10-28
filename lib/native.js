const CapnMidnight = require('../build/Release/capn_midnight');

str = "yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo yolo ";

var buf = new ArrayBuffer(str.length); // 2 bytes for each char
var bufView = new Uint8Array(buf);
for (var i=0, strLen=str.length; i < strLen; i++) {
  bufView[i] = str.charCodeAt(i);
}

encodedObj = CapnMidnight.encode(buf);
encoded = encodedObj.msg;

var encodedStock = new ArrayBuffer(encoded.byteLength);
    new Uint8Array(encodedStock).set(new Uint8Array(encoded));

console.log("Turbo encoded:");
console.log(encodedObj);

encodedView = new Uint8Array(encoded);

errorBits = 0;
for (var i=0; i < 128; i++) { // flip them bits
  if (Math.random() > 0.99) {
    errorBits++;
    encodedView[i] = encodedView[i] == 0 ? 1 : 0;
  }
}

console.log("Munged");
console.log(encoded);

decoded = CapnMidnight.decode({
  bu0: encoded,
  bu1: encodedObj.bu1,
  bu2: encodedObj.bu2
});
console.log("Turbo decoded:");
console.log(decoded);

var encView = new Uint8Array(encodedStock);
var decView = new Uint8Array(decoded);
match = true;
for (var i=0; i < 64; i++) {
  match = match && (decView[i] === encView[i]);
}
console.log(match, errorBits);
