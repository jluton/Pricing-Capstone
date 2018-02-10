const moment = require('moment');
const redisClient = require('./../cache/index');
const { addCalculationToCacheQueue, queue } = require('./../cache/queue');

const cacheTimeLimit = 10;

// Determines whether a timestamp is older than a given number of minutes
const isOlderThanLimit = function (timestamp, minutes = cacheTimeLimit, currentTime = moment()) {
  return currentTime > moment(timestamp).add(minutes, 'minutes');
};

// Calculates the minimum number of cache entries that must be removed for it to not exceed 10,000.
const calculateEntriesToRemove = async function () {
  const cacheEntries = await redisClient.keysAsync('c*');
  return cacheEntries.length > 10000 ? cacheEntries.length - 10000 : 0;
};

// Takes jobs from the cache queue and removes items from the cache until they are all less
// than 10 minutes old or there are no more than 10,000 items in the cache
const archiver = async function () {
  console.log('Archiver running.');
  let currentTime = moment();

  try {
    // Determines whether cache size exceeds 10,000 and if so, how many items must be removed.
    let mustRemove = await calculateEntriesToRemove();

    // Processes job and marks it as done if it should be deleted.
    const processJob = function (job, ctx, done) {
      console.log('processing job ', mustRemove);
      const { id, timestamp } = job;
      if (mustRemove-- > 0 || isOlderThanLimit(timestamp, cacheTimeLimit, currentTime)) {
        redisClient.delAsync(`c:${id}`).catch((err) => { throw new Error(err); });
        done();
      } else {
        // If the calculation should not be removed from the cache, put the job back on the queue and pause the worker.
        ctx.pause(async (err) => {
          if (err) throw new Error(err);
          console.log('Worker is paused.');
          setTimeout(resumeWorker, 10000);
        });
        addCalculationToCacheQueue(id, timestamp, 'high');
      }
    };

    // Recalculates time and minimum entries to remove, and restarts the queue worker.
    const resumeWorker = async function (ctx) {
      currentTime = moment();
      mustRemove = await calculateEntriesToRemove();
      console.log('Worker resuming. Minimum to remove: ', mustRemove);
      ctx.resume();
    };

    // Create the queue worker
    queue.process('calculation', (job, ctx, done) => {
      processJob(job.data, ctx, done);
    });
  } catch (err) {
    throw new Error('Error in archiver: ', err);
  }
};

module.exports = archiver;
