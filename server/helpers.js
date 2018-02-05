const Axios = require('axios');
const { getCachedInstantaneousPrices } = require('./../cache/helpers.js');

const quoteGenerator = async function (instantaneousPrice) {
  // takes in a price
  // fetch all from 10 minute cache (await)
  // append instantaneous price to cache results
  // pass combined results to averaged price algorithm.
  // contrain quote to be between 1 and 5.
  // return quote 

  try {
    const prices = await getCachedInstantaneousPrices();
    prices.push(instantaneousPrice);
    const averagedPrice = prices.reduce((acc, value) => acc + value, 0);
    console.log(averagedPrice);
  } catch (err) {
    throw new Error(err);
  }

  // return {
  //   id: 425245,
  //   quotedSurgeRatio: 1.53,
  //   surgeInEffect: true,
  //   crossedThreshold: true,
  // };
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

quoteGenerator(1);

module.exports = {
  quoteGenerator,
  archiver,
  sendThresholdNotification,
};
