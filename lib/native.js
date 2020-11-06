const Native = require('../build/Release/capn_midnight');

class CapnMidnight {

  static strToBuf(str) {
    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }

    return buf;
  }

  static bufToStr(buf) {

  }

  static encode(buf) {
    return Native.encode(buf);
  }

  static decode(buf) {
    return Native.decode(buf);
  }
}

module.exports = CapnMidnight;
