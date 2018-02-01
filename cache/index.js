const redis = require('redis');

const PORT = 6379;
const redisClient = redis.createClient(PORT);

redisClient.on('connect', () => {
  console.log('Connected to Redis cache.');
});

redisClient.set('language', 'nodejs', (err, reply) => {
  if (err) throw new Error(err);
  console.log('Redis client language set to Node.js: ', reply);
});

module.exports = redisClient;
