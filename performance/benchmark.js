const siege = require('siege');

siege()
  .on(3000)
  .get('/pricing/?totalActiveUsers=30&waitingUsers=5')
  .for(10000).times
  .attack();
