
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function createAdmin() {
  console.log('🚀 Starting admin creation...');

  const name = 'Admin';
  const email = 'admin@himalayatreks.com';
  const password = 'Admin@12345';

  try {
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);

    console.log('📦 Inserting into database...');

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email)
       DO UPDATE SET role = 'admin'
       RETURNING id, name, email, role`,
      [name, email, hashed]
    );

    console.log('✅ Admin user ready:', result.rows[0]);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    process.exit(0);
  }
}

createAdmin();