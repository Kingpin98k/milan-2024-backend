import { Pool } from 'pg';
// @ts-ignore
import { format, buildWhereFromQuery, transformer } from 'sqlutils/pg';
import { disc_error_logger } from '../utils/disc_logger';
import logger, { LogTypes } from '../utils/logger';
import ErrorHandler from '../utils/errors.handler';

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(String(process.env.DB_PORT)),
  ssl: {
    rejectUnauthorized: false, // Use this line if you face self-signed certificate issues
  },
  sslmode: 'require',
};

let pool: Pool;

try {
  pool = new Pool(config);
} catch (err: any) {
  disc_error_logger.error({
    message: err?.message ?? 'sample error',
    error: new Error('sample error'), // This field can be included in other log functions as well
  });
}

export default {
  async query(text: any, params?: any) {
    try {
      const start = Date.now();
      text = text.replace(/\n/g, '');
      // if (isDev) console.log("to be executed query", { text });
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      return res;
    } catch (err: any) {
      disc_error_logger.error({
        message: err?.message ?? 'sample error',
        error: new Error('sample error'), // This field can be included in other log functions as well
      });
      return err as Error;
    }
  },
  async transaction(fn: Function) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client); // Await the result of fn()
      await client.query('COMMIT');
      return result; // Return the result of fn()
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
  format,
  buildWhereFromQuery,
  transformer,
};
