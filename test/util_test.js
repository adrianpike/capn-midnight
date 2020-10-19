const {bitGet, bitSet} = require('../lib/util.js');

const assert = require('assert').strict;

// this is dumb but works for now

assert.equal(0b0, bitGet(0x00, 0));
assert.equal(0b0, bitGet(0x00, 1));
assert.equal(0b0, bitGet(0x00, 2));
assert.equal(0b0, bitGet(0x00, 3));
assert.equal(0b0, bitGet(0x00, 4));
assert.equal(0b0, bitGet(0x00, 5));
assert.equal(0b0, bitGet(0x00, 6));
assert.equal(0b0, bitGet(0x00, 7));

assert.equal(0b1, bitGet(0x01, 0));
assert.equal(0b0, bitGet(0x01, 1));
assert.equal(0b0, bitGet(0x01, 2));
assert.equal(0b0, bitGet(0x01, 3));
assert.equal(0b0, bitGet(0x01, 4));
assert.equal(0b0, bitGet(0x01, 5));
assert.equal(0b0, bitGet(0x01, 6));
assert.equal(0b0, bitGet(0x01, 7));

assert.equal(0b0, bitGet(0x02, 0));
assert.equal(0b1, bitGet(0x02, 1));
assert.equal(0b0, bitGet(0x02, 2));
assert.equal(0b0, bitGet(0x02, 3));
assert.equal(0b0, bitGet(0x02, 4));
assert.equal(0b0, bitGet(0x02, 5));
assert.equal(0b0, bitGet(0x02, 6));
assert.equal(0b0, bitGet(0x02, 7));

assert.equal(0b1, bitGet(0x03, 0));
assert.equal(0b1, bitGet(0x03, 1));
assert.equal(0b0, bitGet(0x03, 2));
assert.equal(0b0, bitGet(0x03, 3));
assert.equal(0b0, bitGet(0x03, 4));
assert.equal(0b0, bitGet(0x03, 5));
assert.equal(0b0, bitGet(0x03, 6));
assert.equal(0b0, bitGet(0x03, 7));

assert.equal(0b1, bitGet(0x03, 0));

assert.equal(0b0, bitGet(0x01, 7));
assert.equal(0b1, bitGet(0x80, 7));

let octet = 0;

assert.equal(0x00, octet);
octet = bitSet(octet, 0, true);
assert.equal(0x01, octet);
octet = bitSet(octet, 0, false);
assert.equal(0x00, octet);
octet = bitSet(octet, 1, true);
assert.equal(0x02, octet);
octet = bitSet(octet, 0, true);
assert.equal(0x03, octet);
octet = bitSet(octet, 2, true);
assert.equal(0x07, octet);
