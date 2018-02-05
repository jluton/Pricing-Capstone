const kue = require('kue');

const queue = kue.createQueue();

// Adds a calculation to a queue, which will be used to remove calculation to cache.
const addCalculationToCacheQueue = function (id, timestamp) {
  queue.create('calculation', {
    id,
    timestamp,
  }).save();
};

module.exports = {
  queue,
  addCalculationToCacheQueue,
};
