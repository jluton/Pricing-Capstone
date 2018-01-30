const Koa = require('koa');
const router = require('./routes.js');

const app = new Koa();
const PORT = 3000;

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, () => console.log(`Koa server listening on port ${PORT}.`));
