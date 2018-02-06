const kue = require('kue');

const queue = kue.createQueue();

// Adds a calculation to a queue, which will be used to remove calculation to cache.
const addCalculationToCacheQueue = function (id, timestamp, priority = 'normal') {
  queue.create('calculation', {
    id,
    timestamp,
  })
    .priority(priority)
    .removeOnComplete(true)
    .save();
};

// Gets top item off queue and passes its data to a callback function.
const getItemOffQueue = function (cb) {
  queue.process('calculation', (job, done) => {
    cb(job.data);
    done();
  });
};

const wipeQueue = function () {
  queue.inactive((err, ids) => {
    if (err) throw new Error(err);
    ids.forEach((id) => {
      kue.Job.get(id, (error, job) => {
        if (err) throw new Error(error);
        job.remove(() => console.log('removed ', job.id));
      });
    });
    console.log('Queue flushed.');
  });
};

const queueSize = function () {
  queue.inactiveCount((err, total) => {
    if (err) throw new Error(err);
    console.log(total);
  });
};

module.exports = {
  getItemOffQueue,
  addCalculationToCacheQueue,
  wipeQueue,
  queueSize,
};
