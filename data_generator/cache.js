const produceRandomData = require('./random_data');
const redisClient = require('./../cache/index');
const { cachePriceQuote, wipeCache } = require('./../cache/helpers');
const { addCalculationToCacheQueue, wipeQueue, queue } = require('./../cache/queue');

const cacheEntries = async function (n) {
  console.log(n);
  const randomData = produceRandomData(false);
  const { calculationId, timestamp } = randomData;
  
  try {
    await cachePriceQuote(randomData);
    addCalculationToCacheQueue(calculationId, timestamp);
    if (n > 1) await cacheEntries(n - 1);
  } catch (err) {
    throw new Error(err);
  }
};

const wipeRedis = async function () {
  try {
    await redisClient.flushdbAsync();
  } catch (err) {
    throw new Error(err);
  }
};

const reportSizes = function () {
  redisClient.dbsizeAsync().then(size => console.log('cache size: ', size));
  queue.inactiveCountAsync().then(count => console.log('queue size: ', count));
};

const regenerateRedis = async function (n) {
  try {
    await wipeRedis();
    await cacheEntries(n);
    setTimeout(() => {
      reportSizes();
    }, 25);
  } catch (err) {
    if (err) throw new Error(err);
  }
};

regenerateRedis(100);

