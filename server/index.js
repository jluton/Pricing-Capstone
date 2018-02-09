// TODO: Remove before deploying to production
const newrelic = require('newrelic');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./routes.js');
const archiver = require('./archiver');

const app = new Koa();
const PORT = 3000;

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, () => console.log(`Koa server listening on port ${PORT}.`));

archiver();
