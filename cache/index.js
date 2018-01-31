const redis = require('redis');

const PORT = 6379;

const cacheClient = redis.createClient(PORT);

cacheClient.on('connect', () => {
  console.log('Connected to Redis cache.');
});

module.exports = {
  cacheClient,
};
