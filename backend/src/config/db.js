// Reusable PostgreSQL connection pool.
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

// query(text, params) -> Promise<result>
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
