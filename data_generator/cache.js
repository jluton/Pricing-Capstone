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
    if (n > 1) cacheEntries(n - 1);
  } catch (err) {
    throw new Error(err);
  }
};

const wipeRedis = async function () {
  try {
    await wipeCache();
    wipeQueue();
  } catch (err) {
    throw new Error(err);
  }
};

const reportSizes = function () {
  redisClient.dbsizeAsync().then(size => console.log('cache size: ', size));
  queue.inactiveCountAsync().then(count => console.log('queue size: ', count));
};

// const regenerateRedis = async function (n) {
//   try {
//     await cacheEntries(n);
//     const cacheSize = await redisClient.dbsizeAsync();
//     let queueSize = null;
//     queue.inactiveCountAsync()
//       .then((size) => {
//         queueSize = size;
//       })
//       .catch((err) => { throw new Error(err); });
//     console.log('Cache size: ' + cacheSize + '\nQueue size: ' + queueSize);
//   } catch (err) {
//     if (err) throw new Error(err);
//   }
// };

// wipeRedis();
// cacheEntries(10);
reportSizes();

