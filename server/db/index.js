const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const select = async (query) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return result;
  } finally {
    client.release();
  }
};

const insert = async (table, values, returning) => {
  const valuesQuery = values.map((cur, idx) => `$${idx + 1}`).join(',');
  let returningQuery = Array.isArray(returning) ? returning : [returning];
  returningQuery = returningQuery.join(',');

  const query = `INSERT INTO ${table} VALUES(${valuesQuery}) RETURNING ${returningQuery}`;

  const client = await pool.connect();
  try {
    const result = await client.query(query, values);
    return result;
  } finally {
    client.release();
  }
};

module.exports = { insert, select };
