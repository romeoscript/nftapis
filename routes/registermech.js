import db from '../connect.js';

export async function getNearbyMechanics(req, res) {
   try {
       const { latitude, longitude, radiusInKm = 10 } = req.query;

       if (!latitude || !longitude) {
           return res.status(400).json({ 
               message: "Latitude and longitude are required." 
           });
       }

       const lat = parseFloat(latitude);
       const lng = parseFloat(longitude);
       const radius = parseFloat(radiusInKm);

       return new Promise((resolve, reject) => {
           // First get all mechanics
           db.all("SELECT * FROM mechanics", [], (err, mechanics) => {
               if (err) {
                   console.error("Database error:", err);
                   return res.status(500).json({
                       message: "Database error",
                       details: err.message
                   });
               }

               // Calculate distances and filter
               const nearbyMechanics = mechanics
                   .map(mechanic => {
                       const distance = calculateDistance(
                           lat,
                           lng,
                           mechanic.latitude,
                           mechanic.longitude
                       );
                       return { ...mechanic, distance };
                   })
                   .filter(mechanic => mechanic.distance <= radius)
                   .sort((a, b) => a.distance - b.distance)
                   .slice(0, 50);

               return res.status(200).json(nearbyMechanics);
           });
       });

   } catch (error) {
       let errorMessage = "Internal Server Error";
       if (error instanceof Error) {
           errorMessage = error.message;
       }
       console.error("Error:", errorMessage);
       if (!res.headersSent) {
           return res.status(500).json({
               message: errorMessage,
               details: error instanceof Error ? error.message : error,
           });
       }
   }
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
   const R = 6371; // Radius of the earth in km
   const dLat = deg2rad(lat2 - lat1);
   const dLon = deg2rad(lon2 - lon1);
   const a = 
       Math.sin(dLat/2) * Math.sin(dLat/2) +
       Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
       Math.sin(dLon/2) * Math.sin(dLon/2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   const d = R * c; // Distance in km
   return d;
}

function deg2rad(deg) {
   return deg * (Math.PI/180);
}