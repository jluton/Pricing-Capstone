const cars = require('./../cars/cars.js');

module.exports = function calculateInstantaneousPrice(usersData) {
  const { totalActiveDrivers, availableDrivers } = cars;
  const { totalActiveUsers, waitingUsers } = usersData;

  const availableDriverFactor = 9;
  const waitingUserFactor = 10;

  return ((1 / (availableDriverFactor * availableDrivers / totalActiveDrivers)) +
  (waitingUserFactor * waitingUsers / totalActiveUsers)) / 2;
};
