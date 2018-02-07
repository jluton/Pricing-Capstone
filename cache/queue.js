const kue = require('kue');
const { promisify } = require('util');

const queue = kue.createQueue();

// Promisified versions of native kue methods.
queue.inactiveCountAsync = promisify(queue.inactiveCount).bind(queue);
queue.activeCountAsync = promisify(queue.activeCount).bind(queue);
queue.inactiveAsync = promisify(queue.inactive).bind(queue);
queue.activeAsync = promisify(queue.active).bind(queue);
kue.Job.getAsync = promisify(kue.Job.get).bind(kue.Job);


// Adds a calculation to a queue, which will be used to remove calculation to cache.
const addCalculationToCacheQueue = function (id, timestamp, priority = 'normal') {
  console.log('adding calculation to queue');
  queue.create('calculation', { id, timestamp })
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

// Deletes all items in queue. For maintenance only.
const wipeQueue = async function () {
  try {
    const ids = await queue.inactiveAsync();
    ids.forEach((id) => {
      kue.Job.getAsync(id)
        .then((job) => {
          job.remove();
        });
    });
  } catch (err) {
    console.log('Error in wipeQueue');
    if (err) throw new Error(err);
  }
};

module.exports = {
  queue,
  getItemOffQueue,
  addCalculationToCacheQueue,
  wipeQueue,
};
