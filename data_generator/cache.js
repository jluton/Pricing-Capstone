const produceRandomData = require('./random_data');
const redisClient = require('./../cache/index');
const { cachePriceQuote, wipeCache } = require('./../cache/helpers');
const { addCalculationToCacheQueue, wipeQueue, queueSize } = require('./../cache/queue');

const cacheEntries = async function (n) {
  console.log(n);
  const randomData = produceRandomData(false);
  const { calculationId, timestamp } = randomData;

  try {
    await cachePriceQuote(randomData);
    addCalculationToCacheQueue(calculationId, timestamp);
    if (n > 0) cacheEntries(n - 1);
  } catch (err) {
    throw new Error(err);
  }
};

const resetRedis = async function () {
  try {
    await wipeCache();
    wipeQueue();
  } catch (err) {
    throw new Error(err);
  }
};

