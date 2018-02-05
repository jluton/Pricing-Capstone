const Axios = require('axios');
const { getCachedInstantaneousPrices } = require('./../cache/helpers.js');

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

const archiver = function () {};

// Notifies Cars service that a price threshold has been crossed, and provides updated surge ratio.
const sendThresholdNotification = function (quotedSurgeRatio) {
  // TODO: fill out url.
  Axios.post('/', { quotedSurgeRatio })
    .then(() => console.log('Threshold notification sent to Cars.'))
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
