const { Readable } = require('stream');

const assert = require('assert').strict;
const util = require('../lib/util.js');

var count = 0;

NUM_TEST_RUNS = 5;
TEST_STRING = "The rain in spain falls mainly in the plain.";

async function * generate() {
  for (var i = 0; i < NUM_TEST_RUNS; i++) {
    yield TEST_STRING;
  }
}

const testBinaryString = util.binaryString(new TextEncoder().encode(TEST_STRING));

const lossyPipe = new util.lossyPipe(0.1);

const readable = Readable.from(generate());

var runningBer;

lossyPipe.on('data', function(chunk) {
  // Why am I doing this as strings? Probably because it's easier at this point,
  // but also possibly because I'm bad at bitwise operations in Javascript.
  var binaryChunk = util.binaryString(chunk);

  assert.equal(binaryChunk.length,  testBinaryString.length);

  var diffBits = 0;
  for (var i = 0; i < binaryChunk.length; i++) {
    if (binaryChunk[i] != testBinaryString[i]) {
      diffBits += 1;
    }
  }
  var ber = diffBits / binaryChunk.length;
  if (typeof(runningBer) === 'undefined') {
    runningBer = ber;
  }
  runningBer += (ber - runningBer) / 2;

  var str = '';
  str += chunk + ' ' + binaryChunk;
  console.log(str);
});

readable.pipe(lossyPipe);

lossyPipe.on('end', function() {
console.log(runningBer);
});
