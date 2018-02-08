const Axios = require('axios');
const moment = require('moment');

const redisClient = require('./../cache/index');
const { getCachedInstantaneousPrices } = require('./../cache/helpers');
const { addCalculationToCacheQueue, queue } = require('./../cache/queue');

// TODO: is there a way for previousTheshold to reset automatically?
let previousThresholdCrossed = 0;
// Time limit in minutes, after which surge ratio calculations are removed from the cache.
const cacheTimeLimit = 10;

// Takes most recent instantaneous price and asynch. returns an object with a quoted surge ratio.
const quoteGenerator = async function (instantaneousPrice) {
  try {
    // Fetches prices from cached and generates an average price.
    const prices = await getCachedInstantaneousPrices();
    prices.push(instantaneousPrice);
    const averagedPrice = prices.reduce((acc, value) => acc + value, 0) / prices.length;
    console.log('averaged price: ', averagedPrice);
    // Determines a quoted surge ratio by constraining averaged price to >= 1 and <= 5.
    let quotedSurgeRatio;
    let surgeInEffect;
    if (averagedPrice > 1) {
      surgeInEffect = true;
      quotedSurgeRatio = averagedPrice < 5 ? averagedPrice : 5;
    } else {
      surgeInEffect = false;
      quotedSurgeRatio = 1;
    }
    // Determines whether the quoted price crossed a 0.5X threshold, for notification to drivers.
    let crossedThreshold = false;
    const thresholdCrossed = Math.floor(quotedSurgeRatio / 0.5) * 0.5;
    if (thresholdCrossed > previousThresholdCrossed) {
      previousThresholdCrossed = thresholdCrossed;
      if (thresholdCrossed > 1) crossedThreshold = true;
    }
    // Returns object with calculated information.
    return {
      quotedSurgeRatio,
      surgeInEffect,
      crossedThreshold,
    };
  } catch (err) {
    throw new Error(err);
  }
};

// Determines whether a timestamp is older than a given number of minutes
const isOlderThanLimit = function (timestamp, minutes = cacheTimeLimit, currentTime = moment()) {
  return currentTime > moment(timestamp).add(minutes, 'minutes');
};

// Takes jobs from the cache queue and removes items from the cache until they are all less
// than 10 minutes old or there are no more than 10,000 items in the cache
const archiver = async function () {
  console.log('Archiver running.');
  let currentTime = moment();

  try {
    // Determines whether cache size exceeds 10,000 and if so, how many items must be removed.
    let cacheEntries = await redisClient.keysAsync('c*');
    let mustRemove = cacheEntries.length > 10000 ? cacheEntries.length - 10000 : 0;

    // Processes job and marks it as done if it should be deleted.
    const processJob = function (job, ctx, done) {
      console.log('processing job');
      console.log(mustRemove);
      const { id, timestamp } = job;
      if (mustRemove-- > 0 || isOlderThanLimit(timestamp, cacheTimeLimit, currentTime)) {
        redisClient.delAsync(`c:${id}`).catch((err) => { throw new Error(err); });
        done();
      } else {
        // If the calculation should not be removed from the cache, put the job back on the queue and pause the worker.
        ctx.pause(async (err) => {
          if (err) throw new Error(err);
          console.log('Worker is paused.');
          setTimeout(async () => {
            currentTime = moment();
            cacheEntries = await redisClient.keysAsync('c*');
            mustRemove = cacheEntries.length > 10000 ? cacheEntries.length - 10000 : 0;
            console.log('entries: ', cacheEntries);
            console.log('must remove: ', mustRemove);
            console.log('Working resuming.');
            ctx.resume();
          }, 10000);
        });
        addCalculationToCacheQueue(id, timestamp, 'high');
      }
    };

    // Create the queue worker
    queue.process('calculation', (job, ctx, done) => {
      processJob(job.data, ctx, done);
    });
  } catch (err) {
    throw new Error('Error in archiver: ', err);
  }
};

// Notifies Cars service that a price threshold has been crossed, and provides updated surge ratio.
const sendThresholdNotification = function (quotedSurgeRatio) {
  // TODO: fill out url.
  Axios.post('/', { quotedSurgeRatio })
    .then(res => console.log(res))
    .catch((err) => {
      console.log('Threshold notification failed!');
      throw new Error(err);
    });
};

module.exports = {
  quoteGenerator,
  archiver,
  sendThresholdNotification,
};
