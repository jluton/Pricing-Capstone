const Axios = require('axios');
const moment = require('moment');

const redisClient = require('./../cache/index');
const { getCachedInstantaneousPrices } = require('./../cache/helpers');
const { getItemOffQueue, addCalculationToCacheQueue } = require('./../cache/queue');

// TODO: is there a way for previousTheshold to reset automatically?
let previousThresholdCrossed = 0;

// Takes most recent instantaneous price and asynch. returns an object with a quoted surge ratio.
const quoteGenerator = async function (instantaneousPrice) {
  try {
    // Fetches prices from cached and generates an average price.
    const prices = await getCachedInstantaneousPrices();
    prices.push(instantaneousPrice);
    const averagedPrice = prices.reduce((acc, value) => acc + value, 0) / prices.length;
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
const isOlderThanLimit = function (timestamp, minutes = 10, currentTime = moment()) {
  return moment(timestamp).add(minutes, 'minutes') > moment(currentTime);
};

// Takes jobs from the cache queue and removes items from the cache until they are all less
// than 10 minutes old or there are no more than 10,000 items in the cache
const archiver = async function () {
  const itemsToArchive = [];
  const currentTime = moment();
  console.log('runs archiver');

  try {
    // Determines whether cache size exceeds 10,000
    const size = await redisClient.dbsizeAsync();
    console.log('size ', size);
    let mustRemove = size > 10000 ? size - 10000 : 0;
    console.log(mustRemove);

    // Takes jobs off queue, and pushes id's to archive to array
    // const archiveItem = (data) => {
    //   if (mustRemove-- > 0 || isOlderThanLimit(data.timestamp, 10, currentTime)) {
    //     itemsToArchive.push(data.id);
    //     getItemOffQueue(archiveItem);
    //   } else {
    //     addCalculationToCacheQueue(data.id, data.timestamp, 'high');
    //   }
    // };

    // getItemOffQueue(archiveItem);
    console.log('hello ', itemsToArchive);

    // Removes items from cache
    // itemsToArchive.forEach((item) => {
    //   redisClient.del(item, (err) => {
    //     if (err) throw new Error(err);
    //   });
    // });
  } catch (err) {
    throw new Error('Error in archiver: ', err);
  }
};

archiver();

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
