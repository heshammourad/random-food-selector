const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const select = async (query, values) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, values);
    return result;
  } finally {
    client.release();
  }
};

const insert = async (table, valueObj, returning) => {
  const indexArray = [];
  const values = [];
  const fields = Object.keys(valueObj).reduce((acc, cur, idx) => {
    indexArray.push(`$${idx + 1}`);
    values.push(valueObj[cur]);

    acc.push(cur);
    return acc;
  }, []);

  const fieldsQuery = fields.join(',');
  const valuesQuery = indexArray.join(',');
  let returningQuery = Array.isArray(returning) ? returning : [returning];
  returningQuery = returningQuery.join(',');

  const query = `INSERT INTO ${table}(${fieldsQuery}) VALUES(${valuesQuery}) RETURNING ${returningQuery}`;

  const client = await pool.connect();
  try {
    const result = await client.query(query, values);
    return result;
  } finally {
    client.release();
  }
};

module.exports = { insert, select };
