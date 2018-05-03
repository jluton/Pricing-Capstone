const { query } = require('./index.js');

// Returns data for a calculation entry with a given Id.
const getCalculationById = function (id) {
  const queryString = `SELECT * FROM quotes WHERE calculation_id='${id}'`;
  return query(queryString);
};

// Takes an id and a boolean and updates a data entry to record whether it was accepted.
const updateAccepted = function (id, accepted) {
  const queryString = `UPDATE quotes SET accepted=${accepted} WHERE calculation_id='${id}'`;
  return query(queryString);
};

// Takes an object with data about a given price quote and stores it in the database.
const storeQuoteEntry = function (data) {
  const {
    calculationId, timestamp, instantaneousPrice, quotedSurgeRatio, totalUsers, waitingUsers,
    totalActiveDrivers, availableDrivers, accepted,
  } = data;

  const queryString = `INSERT INTO quotes (calculation_id, calculation_time, instantaneous_price,
    quoted_price, total_users, waiting_users, total_drivers, available_drivers, accepted)
    VALUES('${calculationId}', '${timestamp}', ${instantaneousPrice}, ${quotedSurgeRatio}, ${totalUsers},
    ${waitingUsers}, ${totalActiveDrivers}, ${availableDrivers}, ${accepted});`;

  return query(queryString);
};

module.exports = {
  getCalculationById,
  storeQuoteEntry,
  updateAccepted,
};
