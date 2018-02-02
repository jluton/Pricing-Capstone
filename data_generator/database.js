const uniqid = require('uniqid');
const moment = require('moment');

const { storeQuoteEntry } = require('./../database/helpers.js');

// Generates an object with randomized quote data.
const produceRandomData = function () {
  const totalUsers = Math.floor(Math.random() * 1000) + 1;
  const waitingUsers = Math.floor(Math.random() * totalUsers * 0.3);
  const totalActiveDrivers = Math.floor(Math.random() * 1000) + 1;
  const availableDrivers = Math.floor(Math.random() * totalActiveDrivers * 0.3);

  let instantaneousPrice = ((1 / (9 * availableDrivers / totalActiveDrivers)) +
  (10 * waitingUsers / totalUsers)) / 2;
  instantaneousPrice = isFinite(instantaneousPrice) ? instantaneousPrice : 0;
  instantaneousPrice = instantaneousPrice <= 5 ? instantaneousPrice: 5;

  let quotedPrice = instantaneousPrice + (Math.random() * 2 - 1);
  quotedPrice = quotedPrice > 1 ? quotedPrice : 1;

  const accepted = Math.round(Math.random() - Math.random() * (quotedPrice - 1) / 5);
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

  return {
    calculationId: uniqid(),
    timestamp,
    instantaneousPrice,
    quotedPrice,
    totalUsers,
    waitingUsers,
    totalActiveDrivers,
    availableDrivers,
    accepted: accepted == true,
  };
};

// Recursively enters n randomly generated rows to the SQL database.
const storeEntries = function (n) {
  console.log(n);
  const data = produceRandomData();
  storeQuoteEntry(data)
    .then(() => {
      if (n > 0) storeEntries(n - 1);
    })
    .catch(err => console.error(err));
};

const hrstart = process.hrtime();
storeEntries(1000000);
const hrend = process.hrtime(hrstart);
console.log(`Process time: ${hrend}`);
