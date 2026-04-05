const { Pool } = require('pg');

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };

const pool = new Pool({
  ...poolConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

(async () => {
  try {
    await pool.connect();
    console.log('✅ PostgreSQL Connected (LOCAL)');
  } catch (err) {
    console.error('❌ DB Connection Failed:', err.message);
  }
})();

// Error handler
pool.on('error', (err) => {
  console.error('Unexpected DB error', err);
});


module.exports = pool;