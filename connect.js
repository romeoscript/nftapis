const sqlite3 = require('sqlite3').verbose();

// Create/connect to database
const db = new sqlite3.Database('./mydata.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to mydata.db database');

    // Create mechanics table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS mechanics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shopName TEXT NOT NULL,
            ownerName TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Mechanics table ready');
    });
});

// Export the database connection
module.exports = db;