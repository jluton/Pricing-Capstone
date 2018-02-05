const uniqid = require('uniqid');
const moment = require('moment');

// Generates an object with randomized quote data.
module.exports = function produceRandomData (includeAccepted = true) {
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

  const accepted = includeAccepted ?
    (Math.round(Math.random() - Math.random() * (quotedPrice - 1) / 5)) == true
    : undefined;
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
    accepted,
  };
};