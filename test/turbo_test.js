const util = require('../lib/util.js');
const CapnMidnight = require('../lib/capn-midnight');
const { Readable } = require('stream');


const lossyPipe = new util.lossyPipe(0.1);

const TEST_STRING = 'Test!';
var testString = new TextEncoder().encode(TEST_STRING);

coder = new CapnMidnight(CapnMidnight.TURBO, {
  interleaver: function(block) {
    return block; // todo: something
  }
});

console.log(new TextDecoder().decode(testString), util.binaryString(testString));

var encoded = coder.encode(testString);
console.log(new TextDecoder().decode(encoded), util.binaryString(encoded));

/*const readable = Readable.from(new TextDecoder().decode(encoded));
var garbled = readable.pipe(lossyPipe);
var garbledString = garbled.toString();

console.log(garbledString, util.binaryString(garbledString));*/

var decoded = coder.decode(encoded);
console.log(new TextDecoder().decode(decoded), util.binaryString(decoded));
