const redis = require('redis');
const redisClient = require('./index.js');

// Takes a data object for a price quote and stores it as a redis hash.
const cachePriceQuote = function (data) {
  const {
    calculationId, timestamp, instantaneousPrice, quotedPrice, totalActiveDrivers,
    availableDrivers, totalUsers, waitingUsers,
  } = data;

  const hashArray = ['timestamp', timestamp, 'instantaneousPrice', instantaneousPrice, 'quotedPrice',
    quotedPrice, 'totalActiveDrivers', totalActiveDrivers, 'availableDrivers', availableDrivers, 'totalUsers',
    totalUsers, 'waitingUsers', waitingUsers,
  ];

  return new Promise((resolve, reject) => {
    redisClient.hmset(calculationId, hashArray, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

// Fetches all instantaneous prices in the cache and returns an array.
const getCachedInstantaneousPrices = async function () {
  const quotes = await getAllCachedQuotes();
  console.log(quotes.length);
  return quotes.map(quote => quote.instantaneousPrice);
};

const getRedisKeys = function () {
  return new Promise((resolve, reject) => {
    redisClient.keys('*', (err, keys) => {
      if (err) reject(err);
      resolve(keys);
    });
  });
};

redisClient.hgetallPromise = function (key) {
  return new Promise((resolve, reject) => {
    this.hgetall(key, (err, obj) => {
      if (err) reject(err);
      resolve(obj);
    });
  });
};

// Fetches all quotes in the cache.
const getAllCachedQuotes = async function () {
  try {
    const promisedQuotes = [];
    const keys = await getRedisKeys();
    keys.forEach((key) => {
      if (key !== 'language') {
        promisedQuotes.push(redisClient.hgetallPromise(key));
      }
    });
    const quotes = await Promise.all(promisedQuotes);
    return quotes;
  } catch (err) {
    throw new Error(err);
  }
};

getCachedInstantaneousPrices();

module.exports = {
  cachePriceQuote,
  getCachedInstantaneousPrices,
  getAllCachedQuotes,
};
