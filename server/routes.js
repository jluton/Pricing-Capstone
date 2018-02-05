const Router = require('koa-router');
const uniqid = require('uniqid');
const moment = require('moment');

const cars = require('./../cars/cars.js');
const { calculateInstantaneousPrice } = require('./algorithms.js');
const { quoteGenerator, sendThresholdNotification } = require('./helpers.js');
const { updateAccepted, storeQuoteEntry } = require('./../database/helpers.js');
const { cachePriceQuote } = require('./../cache/helpers.js');
const { addCalculationToCacheQueue } = require('./../cache/queue');

const router = new Router();

router.get('/pricing/', async (ctx) => {
  // Calls instantaneous price algorithm to generate price based on immediate supply/demand.
  const totalUsers = parseInt(ctx.query.totalUsers, 10);
  const waitingUsers = parseInt(ctx.query.waitingUsers, 10);
  const instantaneousPrice = calculateInstantaneousPrice({
    totalUsers,
    waitingUsers,
  });
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const calculationId = uniqid();

  // Gets a price quote and assembles response object.
  const quoteInfo = await quoteGenerator(instantaneousPrice);
  const { quotedSurgeRatio, surgeInEffect, crossedThreshold } = quoteInfo;
  quoteInfo.calculationId = calculationId;

  // Send quote back to Passengers service.
  ctx.body = quoteInfo;

  // Store instantaneous price in 10 minute cache.
  const cacheData = {
    calculationId,
    timestamp,
    instantaneousPrice,
  };
  cachePriceQuote(cacheData);
  addCalculationToCacheQueue(calculationId, timestamp);


  // Store calculation data in database.
  // TODO: Test this.
  const data = {
    calculationId,
    timestamp,
    instantaneousPrice,
    quotedSurgeRatio,
    totalUsers,
    waitingUsers,
    totalActiveDrivers: cars.totalActiveDrivers,
    availableDrivers: cars.availableDrivers,
    accepted: null,
  };
  storeQuoteEntry(data)
    .catch((err) => { throw new Error(err); });

  // If a price threshold was crossed, notify the Cars service.
  if (crossedThreshold) {
    sendThresholdNotification(quotedSurgeRatio);
  }
});

// Updates the database entry for a calculation whether it was accepted.
router.post('/acceptReject/', async (ctx) => {
  // TODO: Test this. Probably write tests.
  const { quoteId, accepted } = ctx.request.body;
  try {
    await updateAccepted(quoteId, accepted);
    ctx.status = 201;
  } catch (err) {
    throw new Error(err);
  }
});

// Updates active and available cars info stored in global object.
router.post('/cars/', (ctx) => {
  const { totalActiveDrivers, availableDrivers } = ctx.request.body;
  cars.totalActiveDrivers = totalActiveDrivers;
  cars.availableDrivers = availableDrivers;
  ctx.status = 201;
});

module.exports = router;
