const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client('postgres://Jake@localhost:5432/pricing');
client.connect();

module.exports = client;
