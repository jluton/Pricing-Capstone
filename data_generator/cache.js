const produceRandomData = require('./random_data.js');
const { cachePriceQuote } = require('./../cache/helpers.js');

const cacheEntries = function (n) {
  console.log(n);
  const randomData = produceRandomData(false);
  cachePriceQuote(randomData)
    .then(() => {
      if (n > 0) {
        cacheEntries(n - 1);
      }
    })
    .catch((err) => { throw new Error(err); });
};

cacheEntries(100000);
