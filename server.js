"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
process.on('uncaughtException', function (err) {
    //when an uncaught exception occurs, the process needs to be restarted as it is in an unclean state
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
var Pool = pg_1.default.Pool;
var pool = new Pool({
    connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});
var queryText = 'SELECT version()';
pool.query(queryText, function (err, result) {
    if (err) {
        console.error('Error executing query', err);
    }
    else {
        console.log('PostgreSQL version:', result.rows[0].version);
    }
    // Don't forget to release the client back to the pool
    pool.end();
});
