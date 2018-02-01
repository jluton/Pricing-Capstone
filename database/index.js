const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client();
client.connect();
