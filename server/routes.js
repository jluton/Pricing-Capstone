const Router = require('koa-router');
const uniqid = require('uniqid');

const cars = require('./../cars/cars.js');
const { calculateInstantaneousPrice } = require('./algorithms.js');
const { quoteGenerator, sendThresholdNotification } = require('./helpers.js');

const router = new Router();

router.get('/pricing/', async (ctx) => {
  // Calls instantaneous price algorithm to generate price based on immediate supply/demand.
  const totalActiveUsers = parseInt(ctx.query.totalActiveUsers, 10);
  const waitingUsers = parseInt(ctx.query.waitingUsers, 10);
  const instantaneousPrice = calculateInstantaneousPrice({
    totalActiveUsers,
    waitingUsers,
  });
  const calculationId = uniqid();

  // TODO: fill out quoteGenerator function
  // Awaits quoteGenerator, which fetches recent pricing, calls the averaged price algorithm, and produces a quote.
  const quoteInfo = await quoteGenerator(instantaneousPrice);

  // Send quote back to Passengers service.
  ctx.response.status = 200;
  ctx.body = quoteInfo;

  // TODO: Save quote in 10 minute cache.

  // If a price threshold was crossed, notify the Cars service.
  if (quoteInfo.crossedThreshold) {
    // TODO: Updated sendThresholdNotification with Cars service url.
    sendThresholdNotification(quoteInfo.quotedSurgeRatio);
  }
});

router.post('/acceptReject/', (ctx) => {
  // TODO: this will update the cache entry for the price quote with id = quoteID,
  // to include ?accepted
  const { quoteId, accepted } = ctx.request.body;
  console.log(quoteId, accepted);
  ctx.status = 201;
});

// Updates active and available cars info stored in global object.
router.post('/cars/', (ctx) => {
  const { totalActiveDrivers, availableDrivers } = ctx.request.body;
  cars.totalActiveDrivers = totalActiveDrivers;
  cars.availableDrivers = availableDrivers;
  ctx.status = 201;
});

module.exports = router;
