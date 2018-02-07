const redis = require('redis');
const redisScanner = require('redis-scanner');
const { promisify } = require('util');

const PORT = 6379;
const redisClient = redis.createClient(PORT);

redisScanner.bindScanners(redisClient);

// Promisify native redis commands
redisClient.dbsizeAsync = promisify(redisClient.dbsize).bind(redisClient);
redisClient.hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
redisClient.hmsetAsync = promisify(redisClient.hmset).bind(redisClient);
redisClient.keysAsync = promisify(redisClient.keys).bind(redisClient);

redisClient.on('connect', () => {
  console.log('Connected to Redis cache.');
});

redisClient.set('language', 'nodejs', (err, reply) => {
  if (err) throw new Error(err);
  console.log('Redis client language set to Node.js: ', reply);
});

module.exports = redisClient;
