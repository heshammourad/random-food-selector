const { Pool } = require('pg');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

const query = async (text) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text);
    return result;
  } finally {
    client.release();
  }
}

module.exports = { query };
