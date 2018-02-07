const redis = require('redis');
const redisClient = require('./index.js');

// Takes a data object for a price quote and stores it as a redis hash.
// const cachePriceQuote = function (data) {
//   console.log('cachePriceQuote');
//   const { calculationId, timestamp, instantaneousPrice } = data;
//   const hashArray = ['timestamp', timestamp, 'instantaneousPrice', instantaneousPrice];

//   return new Promise((resolve, reject) => {
//     redisClient.hmset(calculationId, hashArray, (err, res) => {
//       if (err) reject(err);
//       resolve(res);
//     });
//   });
// };
const cachePriceQuote = async function (data) {
  console.log('cachePriceQuote');
  const { calculationId, timestamp, instantaneousPrice } = data;
  const hashArray = ['timestamp', timestamp, 'instantaneousPrice', instantaneousPrice];
  // debugger;
  try {
    const res = await redisClient.hmsetAsync(calculationId, hashArray);
    console.log(res);
    const size = await redisClient.dbsizeAsync();
    console.log('cache size: ', size);
    return res;
  } catch (err) {
    console.log('Error in cachePriceQuote!');
    throw new Error(err);
  }
};

// Fetches all instantaneous prices in the cache and returns an array.
const getCachedInstantaneousPrices = async function () {
  const quotes = await getAllCachedQuotes();
  console.log('quotes ', quotes);
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
        promisedQuotes.push(redisClient.hgetallAsync(key));
      }
    });
    console.log('promised quotes: ', promisedQuotes);
    const quotes = await Promise.all(promisedQuotes);
    console.log('quotes ', quotes);
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

// console.log(getCachedInstantaneousPrices());

module.exports = {
  cachePriceQuote,
  getCachedInstantaneousPrices,
  getAllCachedQuotes,
  wipeCache,
};
