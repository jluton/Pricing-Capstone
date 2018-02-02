const client = require('./index.js');

// Takes an object with data about a given price quote and stores it in the database.
const storeQuoteEntry = function (data) {
  const {
    calculationId, timestamp, instantaneousPrice, quotedPrice, totalUsers, waitingUsers,
    totalActiveDrivers, availableDrivers, accepted,
  } = data;

  const queryString = `INSERT INTO quotes (calculation_id, calculation_time, instantaneous_price,
    quoted_price, total_users, waiting_users, total_drivers, available_drivers, accepted)
    VALUES('${calculationId}', '${timestamp}', ${instantaneousPrice}, ${quotedPrice}, ${totalUsers},
    ${waitingUsers}, ${totalActiveDrivers}, ${availableDrivers}, ${accepted});`;

  return client.query(queryString);
};

module.exports = {
  storeQuoteEntry,
};
