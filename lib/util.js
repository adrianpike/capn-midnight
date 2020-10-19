const { Transform } = require('stream');

class LossyPipe extends Transform {
  constructor(ber) {
    super();
    this.ber = ber || 0;
  }

  _transform = function(data, encoding, cb){
    // Assuming data is a buffer, it's actually a uint8array. Node's cool like that.
    let out = new ArrayBuffer(data.length);
    for (var i = 0; i < data.length; i++) {
      var octet = data[i];
      for(var k = 0; k < 8; k++) {
        if (Math.random() < this.ber) {
          data[i] = data[i] ^ (0b1 << k);
        }
      }
    }
    cb(null, data);
  }
}

function* bitIterate(data) {
  for(var i = 0; i < data.length; i++){
    let byte = data[i];
    for(let k=0; k < 8; k++) {
      yield (byte & 1);
      byte >>= 1;
    }
  }
  return data.length;
}

// Bug: this needs to be an ArrayBuffer (or a view on top of it)
function binaryString(data) {
  str = '';

  for(bit of bitIterate(data)) {
    str += bit;
  }

  return str;
}

// Bit setters and getters, because bit-shifting is _hard_
function bitSet(byte, offset, value) {
  if (value) {
    return (byte | (1 << offset));
  } else {
    return (byte & ~(1 << offset));
  }
}

function bitGet(byte, offset) {
  return (byte & (0b1 << offset)) > 0 ? 0b1 : 0b0;
}


module.exports = {
  binaryString: binaryString,
  lossyPipe: LossyPipe,
  bitGet: bitGet,
  bitSet: bitSet
}
