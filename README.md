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
https://www.cs.toronto.edu/~radford/ftp/LDPC-2012-02-11/progs.html
https://github.com/radfordneal/LDPC-codes <-- turbo codes are better at low error rates
https://github.com/libsusa/susa
https://www.youtube.com/watch?v=kRIfpmiMCpU
