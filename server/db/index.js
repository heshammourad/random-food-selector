const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const query = async (queryStr, values) => {
  const client = await pool.connect();
  try {
    const result = await client.query(queryStr, values);
    return result;
  } finally {
    client.release();
  }
};

const select = async (queryStr, values) => {
  const result = await query(queryStr, values);
  return result;
};

const insert = async (table, valueObj, returning) => {
  const indexArray = [];
  const values = [];
  const fields = Object.entries(valueObj).reduce((acc, [key, value], idx) => {
    indexArray.push(`$${idx + 1}`);
    values.push(value);

    acc.push(key);
    return acc;
  }, []);

  const fieldsQuery = fields.join(',');
  const valuesQuery = indexArray.join(',');
  let returningQuery = Array.isArray(returning) ? returning : [returning];
  returningQuery = returningQuery.join(',');

  const queryStr = `INSERT INTO ${table}(${fieldsQuery}) VALUES(${valuesQuery}) RETURNING ${returningQuery}`;

  const result = await query(queryStr, values);
  return result;
};

const update = async (table, fields, condition, conditionValue) => {
  const values = [];
  const fieldsQuery = Object.entries(fields).reduce((acc, [key, value], idx) => {
    values.push(value);

    acc.push(`${key}=$${idx + 1}`);
    return acc;
  }, []);

  const queryStr = `UPDATE ${table}
    SET ${fieldsQuery.join(',')} 
    WHERE ${condition}=$${Object.keys(fields).length + 1}`;
  values.push(conditionValue);

  const result = await query(queryStr, values);
  return result;
};

module.exports = { insert, select, update };
