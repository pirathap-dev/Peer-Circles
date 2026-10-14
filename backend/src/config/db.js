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
  transaction: async (callback) => {
    const client = await pool.connect();
    let transactionStarted = false;
    try {
      await client.query('BEGIN');
      transactionStarted = true;
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      if (transactionStarted) {
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError) {
          console.error('Database transaction rollback error:', rollbackError);
        }
      }
      throw err;
    } finally {
      client.release();
    }
  },
  pool,
};
