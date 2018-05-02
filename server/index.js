// TODO: Remove before deploying to production
const newrelic = require('newrelic');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./routes.js');
const archiver = require('./archiver');
const { quoteGenerator } = require('./helpers');
const redis = require('redis');

console.log('HELLO');

const app = new Koa();
const PORT = 8080;

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, () => console.log(`Koa server listening on port ${PORT}.`));

// app.listen(PORT, () => console.log(`Koa server listening on port ${PORT}.`));
// const redisClient = redis.createClient(6379, 'redis_container2');
// redisClient.on('connect', () => console.log('connected to redis instance.'));
// redisClient.on('error', (err) => { throw err; });

// archiver();
// quoteGenerator();
