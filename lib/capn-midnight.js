const util = require("./util");

class CapnMidnight {
  // very popular code is K: 7, rate 1/2
  // slow but ~+2db: K 15, rate 1/6
  constructor(coder, opts) {
    // [ n, k, K ]
    // n == input data rate
    // k == output symbol rate
    // K == constraint length
    // v == number of memory elements, (K - 1) (aka m in susa?)

    // ultra basic
    this.n = 2;
    this.k = 1;
    this.v = 2;

    this.rate = this.n / this.k;

  }

  encode(stream) {
    let state = ''; // TODO: size this by K

    let readRateCounter = 0;
    let outputBits = []; // this is wack, should be smarter w/bitwise ops

    for (var inputOctet of stream) {
      for(var k = 0; k < 8; k++) {
        let inputBit = util.bitGet(inputOctet, k);
        
        outputBits.push(inputBit);

        readRateCounter += 1;
        if (readRateCounter >= this.n) {
          // append a state onto the tail of the output bitstream
          outputBits.push(inputBit);

          readRateCounter = 0;
        }
      }
    }

    let outputOctet = 0x00;
    let bitsConsumed = 0;
    let outputOctets = [];
    for (let outputBit of outputBits) {
      outputOctet = util.bitSet(outputOctet, bitsConsumed, outputBit === 1);

      bitsConsumed++;
      if (bitsConsumed == 8) {
        bitsConsumed = 0;
        outputOctets.push(outputOctet);
        outputOctet = 0x00;
      }
    }

    let outBuf = new ArrayBuffer(stream.length * this.rate);
    let out = new Uint8Array(outBuf);
    out.set(outputOctets);

    return out;
  }

  decode(stream) {
    
    let readRateCounter = 0;
    let outputBits = []; // this is wack, should be smarter w/bitwise ops

    for (var inputOctet of stream) {
      for(var k = 0; k < 8; k++) {
        let inputBit = util.bitGet(inputOctet, k);

        if (readRateCounter < this.n) {
          outputBits.push(inputBit);
          readRateCounter += 1;
        } else {
          readRateCounter = 0;
        }
      }
    }

    let outputOctet = 0x00;
    let bitsConsumed = 0;
    let outputOctets = [];
    for (let outputBit of outputBits) {
      outputOctet = util.bitSet(outputOctet, bitsConsumed, outputBit === 1);

      bitsConsumed++;
      if (bitsConsumed == 8) {
        bitsConsumed = 0;
        outputOctets.push(outputOctet);
        outputOctet = 0x00;
      }
    }

    let outBuf = new ArrayBuffer(Math.ceil(stream.length / this.rate) + 1);
    let out = new Uint8Array(outBuf);
    out.set(outputOctets);
    return out;
  }
}

module.exports = CapnMidnight;
