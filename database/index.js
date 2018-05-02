const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client('postgres_container');
client.connect();

module.exports = client;
