import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

process.on('uncaughtException', (err) => {
  // when an uncaught exception occurs, the process needs to be restarted as it is in an unclean state
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const { Pool } = pg;

// const pool = new Pool({
//   // connectionString: process.env.POSTGRES_URL + '?sslmode=require',
//   connectionString: process.env.POSTGRES_URL,
//   ssl: false,
// });
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const queryText = 'SELECT version()';

pool.query(queryText, (err, result) => {
  if (err) {
    console.error('Error executing query', err);
  } else {
    console.log('PostgreSQL version:', result.rows[0].version);
  }

  // Don't forget to release the client back to the pool
  pool.end();
});
