const siege = require('siege');

siege()
  .on(3000)
  .get('/pricing/?totalActiveUsers=30&waitingUsers=5')
  .for(100000000).times
  .attack();
