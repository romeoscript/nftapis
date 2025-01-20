import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function getNearbyMechanics(req, res) {
    try {
      const { city } = req.query;
  
      if (!city) {
        return res.status(400).json({ message: "City is required." });
      }
  
      // Fetch mechanics filtered by city
      const mechanics = await db.$queryRaw`
        SELECT 
          *
        FROM Mechanic
        WHERE city ILIKE ${`%${city}%`}
        LIMIT 50
      `;
  
      return res.status(200).json(mechanics);
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
  