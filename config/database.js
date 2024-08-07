const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize the SQLite database
const db = new sqlite3.Database(path.resolve(__dirname, '../database.sqlite'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS profiles (
            uid TEXT PRIMARY KEY,
            health_card_number TEXT UNIQUE DEFAULT '000-000-000',
            phone_number TEXT NOT NULL,
            email_address TEXT UNIQUE NOT NULL DEFAULT 'nomail_default',
            access_code TEXT DEFAULT '0000',
            clinic TEXT DEFAULT 'no_clinic_default'
        )`);
    }
});

module.exports = db;
