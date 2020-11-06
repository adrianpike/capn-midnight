Cap'n Midnight
===

Forward error correction for Javascript. Specifically this is being used as part of my Maquis project for citizen communication.

POC or GTFO
---

```javascript
let cpnm = require('capn-midnight');

let encoder = new cpnm.encoder({});
let decoder = new cpnm.decoder({});

my_delightful_stream.pipe(encoder).pipe(my_lossy_radio_link);
```

Installation
---

Requirements;
 - cmake

```
$ git submodule update --init --recursive # aff3ct and its massive collection of dependencies :)
# TODO: this should be all part of node-gyp right?
$ cd deps/aff3ct && mkdir build && cd build && cmake .. -G"Unix Makefiles" -DCMAKE_BUILD_TYPE=Release -DCMAKE_CXX_FLAGS="-funroll-loops -march=native" -DAFF3CT_COMPILE_EXE="OFF" -DAFF3CT_COMPILE_STATIC_LIB="ON" -DAFF3CT_COMPILE_SHARED_LIB="ON"
$ cd .. && make -j4
```

Reading, Inspiration, Notes
---
https://github.com/libsusa/susa
https://www.youtube.com/watch?v=kRIfpmiMCpU
https://en.wikipedia.org/wiki/BCJR_algorithm
