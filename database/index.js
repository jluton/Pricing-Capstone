const { Client } = require('pg');
require('dotenv').config()

const dbClient = new Client({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  passowrd: process.env.DB_PASSWORD || null
});

dbClient.connect();

module.exports = dbClient;
