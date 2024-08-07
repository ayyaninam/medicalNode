const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize the SQLite database
const db = new sqlite3.Database(path.resolve(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS profiles (
            uid TEXT PRIMARY KEY,
            health_card_number TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            email_address TEXT NOT NULL,
            access_code TEXT,
            clinic TEXT
        )`);
    }
});

module.exports = db;
