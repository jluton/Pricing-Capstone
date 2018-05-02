const kue = require('kue');
const { promisify } = require('util');

const queue = kue.createQueue({
  redis: { 
    port: 6379, 
    host: 'redis_queue',
  }
});

// Promisified versions of native kue methods.
queue.inactiveCountAsync = promisify(queue.inactiveCount).bind(queue);
queue.activeCountAsync = promisify(queue.activeCount).bind(queue);
queue.inactiveAsync = promisify(queue.inactive).bind(queue);
queue.activeAsync = promisify(queue.active).bind(queue);
kue.Job.getAsync = promisify(kue.Job.get).bind(kue.Job);

// Adds a job to a queue containing calculation info, which will be used to remove calculation from cache.
const addCalculationToCacheQueue = function (id, timestamp, priority = 'normal') {
  queue.create('calculation', { id, timestamp })
    .priority(priority)
    .removeOnComplete(true)
    .save();
};

module.exports = {
  queue,
  addCalculationToCacheQueue,
};
