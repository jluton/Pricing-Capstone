const Axios = require('axios');

const quoteGenerator = function () {
  return {
    id: 425245,
    quotedSurgeRatio: 1.53,
    surgeInEffect: true,
    crossedThreshold: true,
  };
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
