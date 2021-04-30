const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_LOCAL_URL,
  /* Change for production
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  */
});

module.exports = {
  pool,
};
