const redis = require('redis');
const redisClient = require('./index.js');

// Takes a data object for a price quote and stores it as a redis hash.
const cachePriceQuote = async function (data) {
  const { calculationId, timestamp, instantaneousPrice } = data;
  const hashArray = ['timestamp', timestamp, 'instantaneousPrice', instantaneousPrice];
  try {
    const res = await redisClient.hmsetAsync(`c:${calculationId}`, hashArray);
    return res;
  } catch (err) {
    console.log('Error in cachePriceQuote!');
    throw new Error(err);
  }
};

// Fetches all quotes in the cache.
const getAllCachedQuotes = async function () {
  try {
    const promisedQuotes = [];
    const keys = await redisClient.keysAsync('c*');
    keys.forEach((key) => {
      if (key !== 'language') {
        promisedQuotes.push(redisClient.hgetallAsync(key));
      }
    });
    const quotes = await Promise.all(promisedQuotes);
    return quotes;
  } catch (err) {
    throw new Error(err);
  }
};

// Fetches all instantaneous prices in the cache and returns an array.
const getCachedInstantaneousPrices = async function () {
  const quotes = await getAllCachedQuotes();
  return quotes.map(quote => quote.instantaneousPrice);
};

module.exports = {
  cachePriceQuote,
  getCachedInstantaneousPrices,
  getAllCachedQuotes,
};
