const redis = require('redis');
const redisClient = require('./index.js');

// Takes a data object for a price quote and stores it as a redis hash.
const cachePriceQuote = function (data) {
  const { calculationId, timestamp, instantaneousPrice } = data;
  const hashArray = ['timestamp', timestamp, 'instantaneousPrice', instantaneousPrice];

  return new Promise((resolve, reject) => {
    redisClient.hmset(calculationId, hashArray, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

// Returns a promise for all values for a hash.
redisClient.hgetallPromise = function (key) {
  return new Promise((resolve, reject) => {
    this.hgetall(key, (err, obj) => {
      if (err) reject(err);
      resolve(obj);
    });
  });
};

// Returns a promise for the number of entries in the cache.
redisClient.dbsizePromise = function () {
  return new Promise((resolve, reject) => {
    redisClient.dbsize((err, size) => {
      if (err) reject(err);
      resolve(size);
    });
  });
};

// Fetches all instantaneous prices in the cache and returns an array.
const getCachedInstantaneousPrices = async function () {
  const quotes = await getAllCachedQuotes();
  return quotes.map(quote => quote.instantaneousPrice);
};

// Fetches all keys in the redis cache.
const getRedisKeys = function () {
  return new Promise((resolve, reject) => {
    redisClient.keys('*', (err, keys) => {
      if (err) reject(err);
      resolve(keys);
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

const wipeCache = function () {
  return new Promise((resolve, reject) => {
    redisClient.flushdb((err, succeeded) => {
      if (err) reject(err);
      console.log('Cache flushed.');
      resolve('flush', succeeded);
    });
  });
};

console.log(getCachedInstantaneousPrices());

module.exports = {
  cachePriceQuote,
  getCachedInstantaneousPrices,
  getAllCachedQuotes,
  wipeCache,
};
