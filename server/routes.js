const Koa = require('koa');
const Router = require('koa-router');

const cars = require('./../Cars/Cars.js');

const router = new Router();

router.get('/pricing/', (ctx) => {
  const totalActiveUsers = parseInt(ctx.query.totalActiveUsers, 10);
  const waitingUsers = parseInt(ctx.query.waitingUsers, 10);
  // Remove status here and do other stuff intead.
  ctx.status = 200;
});

router.post('/acceptReject/', (ctx) => {
  // TODO - this will update the cache entry for the price quote with id = quoteID,
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
