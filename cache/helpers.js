const redisClient = require('./index.js');

// Takes a data object for a price quote and stores it as a redis hash.
const cachePriceQuote = function (data) {
  const {
    calculationId, timestamp, instantaneousPrice, averagedPrice, totalDrivers,
    availableDrivers, totalUsers, waitingUsers,
  } = data;

  redisClient.hmset(
    calculationId,
    ['timestamp', timestamp, 'instantaneousPrice', instantaneousPrice, 'averagedPrice', averagedPrice,
      'totalDrivers', totalDrivers, 'availableDrivers', availableDrivers, 'totalUsers', totalUsers,
      'waitingUsers', waitingUsers,
    ],
    (err) => { if (err) throw new Error(err); },
  );
};

module.exports = {
  cachePriceQuote,
};
