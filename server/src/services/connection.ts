import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error('Environment variables not set!');
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.query('SELECT 1')
  .then(() => console.log('Successfully connected to GCP MySQL database'))
  .catch(err => console.error('Database connection failed:', err));

export default pool;