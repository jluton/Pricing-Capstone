const produceRandomData = require('./random_data.js');
const { storeQuoteEntry } = require('./../database/helpers.js');

// Recursively enters n randomly generated rows to the SQL database.
const storeEntries = function (n) {
  console.log(n);
  const data = produceRandomData();
  storeQuoteEntry(data)
    .then(() => {
      if (n > 1) storeEntries(n - 1);
    })
    .catch(err => console.error(err));
};

console.time('run time');
storeEntries(1);
console.timeEnd('run time');
module.exports = produceRandomData;
