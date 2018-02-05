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

const hrstart = process.hrtime();
storeEntries(10000000);
const hrend = process.hrtime(hrstart);
console.log(`Process time: ${hrend}`);

module.exports = produceRandomData;
