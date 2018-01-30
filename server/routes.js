const Koa = require('koa');
const Router = require('koa-router');

const calculateInstantaneousPrice = require('./../algorithms/instantaneousPrice.js');
const cars = require('./../cars/cars.js');

const router = new Router();

router.get('/pricing/', (ctx) => {
  const totalActiveUsers = parseInt(ctx.query.totalActiveUsers, 10);
  const waitingUsers = parseInt(ctx.query.waitingUsers, 10);
  const instantaneousPrice = calculateInstantaneousPrice({
    totalActiveUsers,
    waitingUsers,
  });
  // TODO: Write middleware that calls price handler. Pass it instantaneous price. Wait
    // Actually, these probably don't need to be middleware, they can probably just be an asynch function
  // TODO: Return price response.
  ctx.status = 200;
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
