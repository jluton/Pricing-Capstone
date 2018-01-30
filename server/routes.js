const Koa = require('koa');
const Router = require('koa-router');

const router = new Router();

router.get('/', (ctx) => {
  ctx.status = 200;
  ctx.body = 'Hello world!';
});

router.get('/pricing/', (ctx) => {});

router.get('/pricing/', (ctx) => {});

router.get('/pricing/', (ctx) => {});

module.exports = router;
