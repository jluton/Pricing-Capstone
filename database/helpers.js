const client = require('./index.js');

const getEntries = function() {
  const queryString = 'SELECT * FROM quotes';
  client.query(queryString)
    .then(res => console.log(res))
    .catch((err) => { throw new Error(err); });
};

const getCalculationById = function(id) {
  const queryString = `SELECT * FROM quotes WHERE calculation_id='${id}'`;
  return client.query(queryString);
};

// Takes an id and a boolean and updates a data entry to record whether it was accepted.
const updateAccepted = function(id, accepted) {
  const queryString = `UPDATE quotes SET accepted=${accepted} WHERE calculation_id='${id}'`;
  return client.query(queryString);
};

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

updateAccepted('2vsa6jd3jd5jxqb4', true);

module.exports = {
  storeQuoteEntry,
  updateAccepted,
};
