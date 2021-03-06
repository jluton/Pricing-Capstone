const produceRandomData = require('./random_data');
const redisClient = require('./../cache/index');
const { cachePriceQuote } = require('./../cache/helpers');
const { addCalculationToCacheQueue, queue } = require('./../cache/queue');

// Recursively generates n randomized calculations, caches them, and creates corresponding queue jobs.
const cacheEntries = async function (n, display = true) {
  if (display) { console.log(n); }
  const randomData = produceRandomData(false);
  const { calculationId, timestamp } = randomData;

  try {
    await cachePriceQuote(randomData);
    addCalculationToCacheQueue(calculationId, timestamp);
    if (n > 1) await cacheEntries(n - 1, display);
  } catch (err) {
    throw new Error(err);
  }
};

// Wipes the redis cache.
const wipeRedis = async function () {
  try {
    await redisClient.flushdbAsync();
  } catch (err) {
    throw new Error(err);
  }
};

// Console logs the total entries, cached calculations, and queue jobs saved in Redis.
const reportSizes = function () {
  redisClient.dbsizeAsync().then(size => console.log('redis size: ', size));
  redisClient.keysAsync('c*').then(entries => console.log('cache entries: ', entries.length));
  queue.inactiveCountAsync().then(count => console.log('queue size: ', count));
};

// Wipes the redis cache, then generates new entries and queue jobs.
const regenerateRedis = async function (n, display = true) {
  try {
    await wipeRedis();
    await cacheEntries(n, display);
    if (display) {
      setTimeout(() => {
        reportSizes();
      }, 25);
    }
  } catch (err) {
    if (err) throw new Error(err);
  }
};

// reportSizes();
// regenerateRedis(100);

module.exports = { regenerateRedis };

