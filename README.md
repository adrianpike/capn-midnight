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

Reading, Inspiration, Notes
---
https://github.com/libsusa/susa
https://www.youtube.com/watch?v=kRIfpmiMCpU
https://en.wikipedia.org/wiki/BCJR_algorithm
