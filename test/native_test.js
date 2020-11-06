const CapnMidnight = require('../lib/native');
const util = require('../lib/util');
const Util = require('../lib/util');

str = "testing123";

var originalBuf = CapnMidnight.strToBuf(str);
var encodedBuf = CapnMidnight.encode(originalBuf);

var encodedBufBackup = new ArrayBuffer(encodedBuf.byteLength);
var backupView = new Uint8Array(encodedBufBackup);
new Uint8Array(encodedBufBackup).set(new Uint8Array(encodedBuf));

// Flip a random set of bits. This happens in place.
encodedView = new Uint8Array(encodedBuf);
errorBits = 0;
for (var i=0; i < encodedBuf.byteLength; i++) { // Every byte
  for(var k=0; k < 8; k++) {
    if (Math.random() > 0.99) {
      errorBits++;
      encodedView[i] = Util.bitSet(encodedView[i], k, Util.bitGet(encodedView[i], k) == 0b0);
    }
  }
}

decoded = CapnMidnight.decode(encodedBuf);

var decodedView = new Uint8Array(decoded);
match = true;
for (var i=0; i < 64; i++) {
  match = match && (decodedView[i] === backupView[i]);
}

console.log("===");
console.log(str, errorBits, match);
console.log("Encoded", encodedBufBackup);
console.log("Errored", encodedBuf);
console.log("Decoded", decoded);
