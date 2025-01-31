import db from './connect.js';

console.log("Starting test...");

// Add a test mechanic
const testMechanic = {
    shopName: "Test Auto Shop",
    ownerName: "John Doe",
    phone: "123-456-7890",
    address: "123 Test St",
    city: "TestCity",
    state: "TS",
    latitude: 40.7128,
    longitude: -74.0060
};

// Wait for database operations to complete
setTimeout(() => {
    console.log("Inserting test mechanic...");
    
    db.run(`
        INSERT INTO mechanics (shopName, ownerName, phone, address, city, state, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        testMechanic.shopName,
        testMechanic.ownerName,
        testMechanic.phone,
        testMechanic.address,
        testMechanic.city,
        testMechanic.state,
        testMechanic.latitude,
        testMechanic.longitude
    ], function(err) {
        if (err) {
            console.error("Error inserting test data:", err);
        } else {
            console.log("Test mechanic added successfully with ID:", this.lastID);
        }

        // Query all mechanics after insertion
        console.log("Querying all mechanics...");
        db.all("SELECT * FROM mechanics", [], (err, rows) => {
            if (err) {
                console.error("Error querying mechanics:", err);
            } else {
                console.log("All mechanics in database:", rows);
            }
            
            // Close the database connection
            db.close((err) => {
                if (err) {
                    console.error("Error closing database:", err);
                } else {
                    console.log("Database connection closed.");
                }
            });
        });
    });
}, 1000);  // Wait 1 second for initial connection