const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const runMigrations = async () => {
    try {
        const client = await pool.connect();
        
        // 002 Notification
        const sql = fs.readFileSync(path.join(__dirname, 'migrations', '002_create_notifications.sql'), 'utf8');
        await client.query(sql);
        console.log('Migration 002 executed.');

        client.release();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runMigrations();
