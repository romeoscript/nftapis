import db from '../connect.js';  // Adjust path as needed

/**
 * @swagger
 * /mechanic/register:  
 *   post:
 *     summary: Register a new mechanic shop.
 *     tags: 
 *         - Mechanic
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shopName:
 *                 type: string
 *               ownerName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *             required:
 *               - shopName
 *               - ownerName
 *               - phone
 *               - address
 *               - city
 *               - state
 *               - latitude
 *               - longitude
 */

export async function registerMechanic(req, res) {
    try {
        const { 
            shopName, 
            ownerName, 
            phone, 
            address, 
            city, 
            state, 
            latitude, 
            longitude 
        } = req.body;

        // Validate required fields
        const requiredFields = ['shopName', 'ownerName', 'phone', 'address', 'city', 'state', 'latitude', 'longitude'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ 
                message: "Invalid phone number format." 
            });
        }

        // Validate latitude and longitude
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ 
                message: "Invalid latitude or longitude values." 
            });
        }

        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO mechanics (
                    shopName, ownerName, phone, address, city, state, latitude, longitude
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(query, 
                [shopName, ownerName, phone, address, city, state, latitude, longitude],
                function(err) {
                    if (err) {
                        console.error('Error registering mechanic:', err);
                        return res.status(500).json({
                            success: false,
                            message: "An error occurred while registering the mechanic shop",
                            error: err.message
                        });
                    }

                    // Get the newly inserted mechanic
                    db.get(
                        'SELECT * FROM mechanics WHERE id = ?', 
                        [this.lastID], 
                        (err, mechanic) => {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: "Error retrieving the created mechanic",
                                    error: err.message
                                });
                            }

                            return res.status(201).json({
                                success: true,
                                message: "Mechanic shop registered successfully",
                                data: mechanic
                            });
                        }
                    );
                }
            );
        });

    } catch (error) {
        console.error('Error registering mechanic:', error);
        
        return res.status(500).json({
            success: false,
            message: "An error occurred while registering the mechanic shop",
            error: error.message
        });
    }
}