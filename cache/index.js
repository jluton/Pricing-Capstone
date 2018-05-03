const redis = require('redis');
const redisScanner = require('redis-scanner');
const { promisify } = require('util');
require('dotenv').config();

const redisClient = redis.createClient(process.env.CACHE_PORT, process.env.CACHE_HOST );

redisClient.on('connect', () => console.log('Connected to Redis cache.'));
redisClient.on('error', (err) => { throw err; });

redisScanner.bindScanners(redisClient);

// Promisify native redis commands
redisClient.dbsizeAsync = promisify(redisClient.dbsize).bind(redisClient);
redisClient.hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
redisClient.hmsetAsync = promisify(redisClient.hmset).bind(redisClient);
redisClient.keysAsync = promisify(redisClient.keys).bind(redisClient);
redisClient.flushdbAsync = promisify(redisClient.flushdb).bind(redisClient);
redisClient.delAsync = promisify(redisClient.del).bind(redisClient);

redisClient.set('language', 'nodejs', (err, reply) => {
  if (err) throw err;
  console.log('Redis client language set to Node.js: ', reply);
});

module.exports = redisClient;
