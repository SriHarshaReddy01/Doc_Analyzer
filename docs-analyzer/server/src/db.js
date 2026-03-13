const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS upload_history (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      extracted_text TEXT,
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  // Add column to existing tables that were created without it
  await pool.query(`
    ALTER TABLE upload_history ADD COLUMN IF NOT EXISTS extracted_text TEXT
  `);
}

module.exports = { pool, initDb };
