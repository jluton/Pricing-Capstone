const { expect, should } = require('chai');
const redisClient = require('./../cache/index');
const { queue, addCalculationToCacheQueue } = require('./../cache/queue');

// TODO: The tests were working, and then I ran queue shutdown. Now nothing works :()

describe('Queue', () => {
  before(async () => {
    await redisClient.flushdbAsync().catch((err) => { throw new Error(err); });
    console.log('REDIS FLUSHED');
  })
  after(() => {});
  it('Should add calculations to the queue', async () => {
    addCalculationToCacheQueue('TestEntry1', '2018-02-09T23:33:17.000Z');
    addCalculationToCacheQueue('TestEntry2', '2018-02-09T23:34:17.000Z');
    addCalculationToCacheQueue('TestEntry3', '2018-02-09T23:35:17.000Z');

    let jobObject = await new Promise((resolve) => {
      queue.process('calculation', (job, done) => {
        resolve({ job, done });
      })
    });

    expect(jobObject.job.data.id).to.equal('TestEntry1');
    expect(jobObject.job.data.timestamp).to.equal('2018-02-09T23:33:17.000Z');

    jobObject = await new Promise((resolve) => {
      queue.process('calculation', (job, done) => {
        resolve({ job, done });
      })
    });

    expect(jobObject.job.data.id).to.equal('TestEntry2');
    expect(jobObject.job.data.timestamp).to.equal('2018-02-09T23:34:17.000Z');
  });
  it('Should be able to add high priority items', async() => {
    addCalculationToCacheQueue('TestEntry4', '2018-02-09T23:33:17.000Z');
    addCalculationToCacheQueue('TestEntry5', '2018-02-09T23:37:17.000Z', 'high');

    queue.process('calculation', (job, done) => { return; });

    const jobObject = await new Promise((resolve) => {
      queue.process('calculation', (job, done) => {
        resolve({ job, done });
      })
    });

    expect(jobObject.job.data.id).to.equal('TestEntry5');
    expect(jobObject.job.data.timestamp).to.equal('2018-02-09T23:37:17.000Z');
  });
});